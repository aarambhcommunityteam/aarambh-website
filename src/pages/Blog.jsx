import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      if (!supabase) {
        setPosts([]);
        setIsLoading(false);
        return;
      }

      try {
        setLoadError("");

        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            "id,title,excerpt,author,date,category,image_url,read_time,status,created_at"
          )
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (isMounted) {
          setPosts(data || []);
        }
      } catch (error) {
        if (isMounted) {
          setPosts([]);
          setLoadError("Articles are temporarily unavailable.");
          console.error("Error loading blog posts:", error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(posts.map((post) => post.category).filter(Boolean)),
    ];

    return ["all", ...uniqueCategories];
  }, [posts]);

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Journal Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
          >
            AARAMBH Journal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Ideas, insights, and stories about entrepreneurship, technology,
            and building something meaningful.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories: show only categories from real articles */}
        {!isLoading && posts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-google-blue text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {category === "all" ? "All Articles" : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Published Articles */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Latest Articles
          </h2>

          {isLoading ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              Loading articles...
            </div>
          ) : loadError ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400">{loadError}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our stories are yet to be written
              </h3>

              <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400 leading-relaxed">
                We're preparing articles about entrepreneurship, technology,
                startup journeys, and lessons from our community. Check back
                as AARAMBH grows.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {post.image_url && (
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block bg-blue-50 dark:bg-blue-900/30 text-google-blue px-3 py-1 rounded-full text-xs font-bold mb-4">
                        {post.category}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-5 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-5">
                      {post.author && (
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {post.author}
                        </span>
                      )}

                      {post.date && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {post.date}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      {post.read_time && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.read_time}
                        </span>
                      )}

                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center text-google-blue font-medium hover:underline"
                      >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Blog;