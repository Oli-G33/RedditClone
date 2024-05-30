'use client';

import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Users } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(commandRef, () => {
    setInput('');
    setShowResults(false);
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ['search-query'],
    enabled: false
  });

  useEffect(() => {
    setInput('');
  }, [pathname]);

  return (
    <div className="relative w-2/3">
      <input
        type="text"
        placeholder="Search communities..."
        className="w-full px-2 py-1 bg-white border border-none rounded-md outline-none focus:border-none focus:outline-none ring-0"
        value={input}
        onChange={e => {
          setInput(e.target.value);
          debounceRequest();
          setShowResults(true);
        }}
      />
      {queryResults && showResults && (
        <div
          ref={commandRef}
          className="absolute left-0 w-full overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md top-full max-h-40"
        >
          {queryResults.map(result => (
            <div
              key={result.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 mx-2" />
                <a href={`/r/${result.name}`}>r/{result.name}</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
