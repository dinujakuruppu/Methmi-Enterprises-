
-- Improve queries that order tours by sort_order and slug

CREATE INDEX IF NOT EXISTS idx_tours_sort_order_slug
ON public.tours (sort_order, slug);