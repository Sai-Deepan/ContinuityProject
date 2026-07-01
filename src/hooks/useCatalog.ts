import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Component } from '../types';

import { toast } from 'sonner';

export function useCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all components once
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    fetch('/api/components')
      .then(res => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setComponents(data);
          setLoading(false);
          setError(null);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError("Failed to load components. Please check your connection.");
          toast.error("Failed to connect to the server. Working offline?", {
            action: {
              label: 'Retry',
              onClick: () => window.location.reload()
            }
          });
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, []);

  // Parse URL Parameters
  const searchQuery = searchParams.get('search') || '';
  const selectedCategories = searchParams.getAll('category');
  const selectedManufacturers = searchParams.getAll('mfg');
  const sort = searchParams.get('sort') || 'featured';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const itemsPerPage = 9;

  // Filter and Sort Logic (Memoized for performance)
  const filteredAndSortedComponents = useMemo(() => {
    let result = [...components];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.manufacturer.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }

    // Categories
    if (selectedCategories.length > 0) {
      result = result.filter(c => selectedCategories.includes(c.category));
    }

    // Manufacturers
    if (selectedManufacturers.length > 0) {
      result = result.filter(c => selectedManufacturers.includes(c.manufacturer));
    }

    // Price
    if (minPrice) {
      result = result.filter(c => c.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(c => c.price <= parseFloat(maxPrice));
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id)); // Simple mock newest sorting
    }

    return result;
  }, [components, searchQuery, selectedCategories, selectedManufacturers, minPrice, maxPrice, sort]);

  // Pagination Logic
  const totalItems = filteredAndSortedComponents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Ensure page is within bounds
  const validPage = Math.max(1, Math.min(page, Math.max(1, totalPages)));
  
  const paginatedComponents = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage;
    return filteredAndSortedComponents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedComponents, validPage]);

  // State Updates (Helper functions that update the URL)
  const setFilter = (key: string, value: string, checked?: boolean) => {
    const newParams = new URLSearchParams(searchParams);
    
    // For arrays (checkboxes)
    if (checked !== undefined) {
      const values = newParams.getAll(key);
      newParams.delete(key);
      const newValues = checked 
        ? [...values, value] 
        : values.filter(v => v !== value);
      
      newValues.forEach(v => newParams.append(key, v));
    } else {
      // For single values (sort, string)
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    }
    
    // Reset to page 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams();
    if (searchQuery) newParams.set('search', searchQuery); // Preserve search
    setSearchParams(newParams);
  };

  const setPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    components: paginatedComponents,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage: validPage,
    searchQuery,
    selectedCategories,
    selectedManufacturers,
    minPrice,
    maxPrice,
    sort,
    setFilter,
    clearFilters,
    setPage
  };
}
