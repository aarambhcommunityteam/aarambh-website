-- AARAMBH's CURRENT schema uses admin_users(user_id, role), not legacy admins.
-- Run once in the connected project's Supabase SQL Editor before deploying.
-- Safe to rerun. Does not delete content, change roles, or disable table RLS.
begin;

-- Do not expose a pre-existing private bucket by silently changing its access.
do $$
begin
  if exists (select 1 from storage.buckets where id in
    ('event-images','member-profiles','resource-thumbnails','blog-images','gallery-images')
    and public = false) then
    raise exception 'An expected photo bucket is private. Review its contents and choose a dedicated public photo bucket before running this setup.';
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
select bucket, bucket, true, 5000000, array['image/jpeg','image/png','image/webp']
from unnest(array['event-images','member-profiles','resource-thumbnails','blog-images','gallery-images']) as bucket
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.can_upload_content_image(p_bucket text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = (select auth.uid()) and (
      (p_bucket = 'member-profiles' and a.role = 'super_admin') or
      (p_bucket in ('event-images','gallery-images') and a.role in ('super_admin','admin')) or
      (p_bucket in ('blog-images','resource-thumbnails') and a.role in ('super_admin','admin','editor'))
    )
  );
$$;
revoke all on function public.can_upload_content_image(text) from public;
grant execute on function public.can_upload_content_image(text) to authenticated;

drop policy if exists aarambh_content_image_insert on storage.objects;
create policy aarambh_content_image_insert on storage.objects for insert to authenticated
with check (public.can_upload_content_image(bucket_id) and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists aarambh_content_image_select on storage.objects;
create policy aarambh_content_image_select on storage.objects for select to authenticated
using (public.can_upload_content_image(bucket_id) and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists aarambh_content_image_delete on storage.objects;
create policy aarambh_content_image_delete on storage.objects for delete to authenticated
using (public.can_upload_content_image(bucket_id) and (storage.foldername(name))[1] = (select auth.uid())::text);

-- SECURITY INVOKER keeps every existing table permission/RLS policy in force.
-- A failed detail insert rolls back the entire event edit, including deletions.
create or replace function public.save_event_content(p_event jsonb, p_event_id uuid default null)
returns uuid language plpgsql security invoker set search_path = '' as $$
declare
  v_event public.events;
  v_id uuid;
begin
  if not exists (select 1 from public.admin_users where user_id = (select auth.uid()) and role in ('super_admin','admin')) then
    raise exception 'You do not have permission to save events.' using errcode = '42501';
  end if;
  select * into v_event from jsonb_populate_record(null::public.events, p_event);
  if nullif(trim(v_event.title), '') is null then raise exception 'Enter an event title.'; end if;
  if v_event.end_date < v_event.date then raise exception 'The end date must not be before the start date.'; end if;

  if p_event_id is null then
    insert into public.events (title,slug,category,status,description,date,end_date,time,location,cover_image_url,banner_image_url,registration_link,color,featured,tags)
    values (trim(v_event.title),coalesce(nullif(v_event.slug,''),'event-' || gen_random_uuid()::text),v_event.category,coalesce(v_event.status,'draft'),v_event.description,v_event.date,v_event.end_date,v_event.time,v_event.location,v_event.cover_image_url,v_event.banner_image_url,v_event.registration_link,v_event.color,coalesce(v_event.featured,false),coalesce(v_event.tags,array[]::text[]))
    returning id into v_id;
  else
    -- Lock before replacing details to serialize concurrent edits of this event.
    select id into v_id from public.events where id = p_event_id for update;
    if v_id is null then raise exception 'Event not found or access denied.' using errcode = '42501'; end if;
    update public.events set
      title = trim(v_event.title), slug = coalesce(nullif(v_event.slug,''),slug),
      category = v_event.category, status = v_event.status, description = v_event.description,
      date = v_event.date, end_date = v_event.end_date, time = v_event.time, location = v_event.location,
      cover_image_url = v_event.cover_image_url, banner_image_url = v_event.banner_image_url,
      registration_link = v_event.registration_link, color = v_event.color,
      featured = coalesce(v_event.featured,false), tags = coalesce(v_event.tags,array[]::text[]), updated_at = now()
    where id = v_id;
    if not found then raise exception 'Event update was denied.' using errcode = '42501'; end if;
    delete from public.event_timeline_items where event_id = v_id;
    delete from public.event_themes where event_id = v_id;
    delete from public.event_prizes where event_id = v_id;
    if exists (select 1 from public.event_timeline_items where event_id = v_id)
       or exists (select 1 from public.event_themes where event_id = v_id)
       or exists (select 1 from public.event_prizes where event_id = v_id) then
      raise exception 'Event details could not be replaced. Check delete permissions.' using errcode = '42501';
    end if;
  end if;

  insert into public.event_timeline_items (event_id,title,date,time,description,label,order_index)
  select v_id, x.title, x.date, x.time, x.description, x.label, x.order_index
  from jsonb_to_recordset(coalesce(p_event->'timeline','[]'::jsonb)) as x(title text,date date,time time,description text,label text,order_index int);

  insert into public.event_themes (event_id,theme,order_index)
  select v_id, value, (ordinality - 1)::int
  from jsonb_array_elements_text(coalesce(p_event->'themes','[]'::jsonb)) with ordinality;

  insert into public.event_prizes (event_id,position,amount,description,icon,order_index)
  select v_id, x.position, x.amount, x.description, x.icon, x.order_index
  from jsonb_to_recordset(coalesce(p_event->'prizes','[]'::jsonb)) as x(position text,amount text,description text,icon text,order_index int);
  return v_id;
end;
$$;
revoke all on function public.save_event_content(jsonb,uuid) from public;
grant execute on function public.save_event_content(jsonb,uuid) to authenticated;
notify pgrst, 'reload schema';
commit;
