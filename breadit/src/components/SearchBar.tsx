'use client';

import { Prisma, Subreddit } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/use-on-click-outside';
import { Users, Search } from 'lucide-react';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import Link from 'next/link';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('');
  const pathname = usePathname();
  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(commandRef, () => {
    setInput('');
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
    <div className="w-1/3 sm:w-2/3">
      <Autocomplete
        value={input}
        onValueChange={text => {
          setInput(text);
          debounceRequest();
        }}
        placeholder="Search communities..."
        className="relative z-50 bg-white border border-none rounded-lg outline-none focus:border-none focus:outline-none ring-0"
        selectorIcon={null}
        startContent={<Search className="w-6 h-6 mr-2" color="#949494" />}
        aria-label="Search bar"
      >
        {/* @ts-expect-error*/}
        {queryResults &&
          Array.isArray(queryResults) &&
          queryResults.map(result => (
            <AutocompleteItem
              key={result.id}
              startContent={<Users className="w-4 h-4" />}
              aria-label={result.name}
              className="inset-x-0 bg-white shadow top-full"
              onSelect={e => {
                router.push(`/r/${e}`);
              }}
              hideSelectedIcon={true}
            >
              <Link href={`/r/${result.name}`}>r/{result.name}</Link>
            </AutocompleteItem>
          ))}
      </Autocomplete>
    </div>
  );
};

export default SearchBar;
