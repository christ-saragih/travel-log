import { useEffect, useState } from "react";
import { useArticleStore } from "@/stores/useArticleStore";
import ArticleList from "../components/ArticleList";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { articleService } from "@/services/article.service";
import { type Category } from "@/types/api.types";

export default function HomePage() {
  const { articles, isLoading, fetchArticles, pagination } = useArticleStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await articleService.getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    fetchArticles(1, search, category);
    // We intentionally don't refetch on every keystroke.
    // Searching is triggered by submit and page navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search, category });
    fetchArticles(1, search, category);
  };

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage, search, category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      <section className="space-y-6 py-4 md:py-8">
        <div className="space-y-3">
          <div className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Community travel stories
          </div>
          <h1 className="text-foreground text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            Discover places worth remembering
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg">
            Browse travel articles from explorers around the world—destinations,
            itineraries, and practical tips in one clean feed.
          </p>
        </div>

        <Card className="bg-card">
          <CardContent className="p-4 md:p-5">
            <form
              onSubmit={handleSearch}
              className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-end"
            >
              <div className="space-y-1.5">
                <div className="text-muted-foreground text-xs font-medium">
                  Search
                </div>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Search destinations, titles, keywords…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-muted-foreground text-xs font-medium">
                  Category
                </div>
                <Select
                  value={category || "all"}
                  onValueChange={(value) =>
                    setCategory(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-full mb-0">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full md:w-auto">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-foreground text-xl font-semibold">
              Latest articles
            </h2>
            <p className="text-muted-foreground text-sm">
              Fresh stories from the community.
            </p>
          </div>
        </div>
        <ArticleList articles={articles} isLoading={isLoading} />
      </section>

      {pagination && pagination.pageCount > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm font-medium">
            Page {pagination.page} of {pagination.pageCount}
          </span>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pageCount}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
