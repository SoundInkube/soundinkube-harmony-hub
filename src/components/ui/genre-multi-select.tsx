import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGenres, Genre } from '@/hooks/useGenres';

interface GenreMultiSelectProps {
  selectedGenres: string[];
  onGenresChange: (genreIds: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  className?: string;
}

export function GenreMultiSelect({
  selectedGenres,
  onGenresChange,
  placeholder = "Select genres...",
  maxItems = 10,
  className
}: GenreMultiSelectProps) {
  const { genres, loading, getGenresByCategory } = useGenres();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const genresByCategory = getGenresByCategory();

  const selectedGenreObjects = genres.filter(genre => selectedGenres.includes(genre.id));

  const toggleGenre = (genreId: string) => {
    const newSelection = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId].slice(0, maxItems);
    
    onGenresChange(newSelection);
  };

  const removeGenre = (genreId: string) => {
    onGenresChange(selectedGenres.filter(id => id !== genreId));
  };

  const clearAll = () => {
    onGenresChange([]);
  };

  // Filter genres based on search
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    genre.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredGenresByCategory = Object.keys(genresByCategory).reduce((acc, category) => {
    const filteredInCategory = genresByCategory[category].filter(genre =>
      filteredGenres.includes(genre)
    );
    if (filteredInCategory.length > 0) {
      acc[category] = filteredInCategory;
    }
    return acc;
  }, {} as Record<string, Genre[]>);

  if (loading) {
    return (
      <Button
        variant="outline"
        className={cn("w-full justify-between", className)}
        disabled
      >
        Loading genres...
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedGenreObjects.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedGenreObjects.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {genre.name}
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[400px] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search genres..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No genres found.</CommandEmpty>
              
              {/* Selected Genres Section */}
              {selectedGenreObjects.length > 0 && (
                <CommandGroup heading="Selected Genres">
                  <div className="p-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedGenreObjects.map((genre) => (
                        <Badge
                          key={genre.id}
                          variant="default"
                          className="text-xs flex items-center gap-1"
                        >
                          {genre.name}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGenre(genre.id);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    {selectedGenreObjects.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="h-6 text-xs"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </CommandGroup>
              )}

              {/* Genre Categories */}
              {Object.entries(filteredGenresByCategory).map(([category, categoryGenres]) => (
                <CommandGroup key={category} heading={category}>
                  {categoryGenres.map((genre) => (
                    <CommandItem
                      key={genre.id}
                      value={genre.name}
                      onSelect={() => toggleGenre(genre.id)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedGenres.includes(genre.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{genre.name}</div>
                        {genre.description && (
                          <div className="text-xs text-muted-foreground">
                            {genre.description}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Display selected genres as badges below */}
      {selectedGenreObjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedGenreObjects.map((genre) => (
            <Badge
              key={genre.id}
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              {genre.name}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeGenre(genre.id)}
              />
            </Badge>
          ))}
          {selectedGenreObjects.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-6 text-xs px-2 text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
      )}

      {selectedGenres.length >= maxItems && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxItems} genres can be selected.
        </p>
      )}
    </div>
  );
}