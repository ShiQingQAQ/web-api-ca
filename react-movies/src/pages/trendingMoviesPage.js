import React, { useState, useEffect } from "react";
import { getTrendingMovies } from "../api/tmdb-api";
import PageTemplate from '../components/templateMovieListPage';
import { useQuery, useQueryClient } from 'react-query';
import Spinner from '../components/spinner';
import AddToFavoritesIcon from '../components/cardIcons/addToFavorites';

const TrendingMoviesPage = () => {
  const [page, setPage] = useState(1); // 当前页码状态

  // 使用 useQueryClient 来操作缓存
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError } = useQuery(
    ['trending', page], // 使用页码作为查询键的一部分
    () => getTrendingMovies(page), // 传递页码给 API 函数
    {
      keepPreviousData: true, // 保留上一页数据，避免闪烁
      staleTime: page === 1 ? 60 * 60 * 1000 : 0, // 第一页缓存1小时，其余页即时请求
      cacheTime: 5 * 60 * 1000, // 缓存保留5分钟后清理
    }
  );

  // 预取第一页数据（静态缓存优化）
  useEffect(() => {
    queryClient.prefetchQuery(['trending', 1], () => getTrendingMovies(1), {
      staleTime: 60 * 60 * 1000, // 第一页缓存1小时
    });
  }, [queryClient]);

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data.results;

  return (
    <>
      <PageTemplate
        title="Trending Movies"
        movies={movies}
        action={(movie) => {
          return <AddToFavoritesIcon movie={movie} />;
        }}
      />
      {/* 分页控制 */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === data.total_pages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TrendingMoviesPage;

