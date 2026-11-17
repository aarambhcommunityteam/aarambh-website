# Admin content fixes

These changes are local until the updated project is deployed to Vercel.

## Apply the database setup

1. Open the Supabase project used by `www.aarambh-community.in`.
2. In **SQL Editor → New query**, paste the entire contents of `supabase/admin-content-setup.sql` and run it.
3. Confirm that Storage shows these public photo buckets: `blog-images`, `gallery-images`, `resource-thumbnails`, `member-profiles`, and `event-images`.
4. Deploy this project's updated source through the existing Vercel project and Git repository. Keep the existing custom domain and Supabase environment values.
5. Sign in at `/admin` and test creating a draft, editing it, uploading a photo, and publishing it for each permitted content type. Check the public pages while signed out too.

Use **this new SQL file only** for the existing deployment. The older `schema.sql`, `functions.sql`, `rls-policies.sql`, and `storage.sql` describe the upstream starter's `admins` table. The connected site uses `admin_users(user_id, role)` and different content fields.

The setup does not delete content, change team roles, or disable existing table RLS. It creates photo storage and an event-saving function that respects existing RLS. It refuses to turn any existing private photo bucket public. If it reports that case, review that bucket's contents before changing access.

Existing role rules are retained: founder (`super_admin`) manages members; founder and `admin` manage events/gallery; founder, `admin`, and `editor` manage blogs/resources. A permission error after setup requires checking the existing table policies for that role; no service-role key belongs in frontend settings.

## Photo specifications shown in the forms

All fields accept JPG, PNG, or WebP files up to **5 MB (5,000,000 bytes)**. Dimensions below are recommendations, not upload restrictions. Cards may crop images to fit.

| Photo | Recommended dimensions |
| --- | --- |
| Member | 800 × 800 px |
| Blog cover | 1200 × 675 px |
| Resource cover | 1200 × 675 px |
| Event cover | 1200 × 675 px |
| Event banner | 1920 × 720 px |
| Gallery | 1600 × 1200 px |

Select a photo file and save the form. Existing photo URLs remain usable and are displayed as previews; entering an image URL is no longer required. Photos use unique filenames so replacing a photo does not overwrite the original. Failed saves retain the form and selected file. Old successfully saved images are retained in Storage; removal from a form unlinks them without deleting files other content may use.

Blogs now support full article text and a working Read More page. Gallery displays published database photos. Drafts stay out of the public lists. Newly added members are hidden until published with the eye button on the member card.

## Checks

Run `node --test tests/admin-content.test.mjs` and `npm run build` from this folder. These check payload mappings, image validation, upload failure handling, and compilation. A separate local PostgreSQL-compatible check exercised the setup SQL, transaction rollback, and storage role restrictions. These checks do not replace a signed-in test against the deployed project's actual RLS policies.

The original source is preserved in Git history before this branch.
