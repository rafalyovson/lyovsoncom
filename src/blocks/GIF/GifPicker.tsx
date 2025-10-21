"use client";

import { Button, FieldLabel, TextInput, useForm } from "@payloadcms/ui";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { calculateAspectRatio } from "@/utilities/tenor";
import { searchGifs } from "./actions";

/**
 * GIF Picker Component for Payload Admin
 *
 * Provides an integrated Tenor GIF search interface directly in the
 * Lexical editor's GIF block. Users can search and select GIFs without
 * leaving the admin panel.
 */

// Types
interface TenorResult {
  id: string;
  media_formats: {
    tinygif: {
      url: string;
      dims: [number, number];
    };
    mp4: {
      url: string;
      dims: [number, number];
    };
  };
}

// Component
export const GifPicker: React.FC = () => {
  // Hardcoded field paths - this component is only used in embedCode group
  const postIdFieldPath = "embedCode.postId";
  const aspectRatioFieldPath = "embedCode.aspectRatio";
  // Form integration
  const { dispatchFields } = useForm();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<TenorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGifId, setSelectedGifId] = useState<string | null>(null);

  // Handlers
  const handleSearch = useCallback(async () => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const gifs = await searchGifs(searchTerm);
      setResults(gifs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search GIFs. Please try again."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const handleSelectGif = useCallback(
    (result: TenorResult) => {
      const aspectRatio = calculateAspectRatio(result.media_formats.mp4.dims);

      // Update form fields
      dispatchFields({
        type: "UPDATE",
        path: postIdFieldPath,
        value: result.id,
      });

      dispatchFields({
        type: "UPDATE",
        path: aspectRatioFieldPath,
        value: aspectRatio,
      });

      // Mark as selected
      setSelectedGifId(result.id);
    },
    [postIdFieldPath, aspectRatioFieldPath, dispatchFields]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Debounced auto-search
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm, handleSearch]);

  // Render
  return (
    <div className="field-type gif-picker">
      <FieldLabel label="Search Tenor GIFs" />

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <TextInput
            value={searchTerm}
            onChange={(e: string | React.ChangeEvent<HTMLInputElement>) => {
              if (typeof e === "string") {
                setSearchTerm(e);
              } else if (e?.target?.value !== undefined) {
                setSearchTerm(e.target.value);
              }
            }}
            onKeyDown={handleKeyPress}
            placeholder="Search for GIFs..."
            path="gifSearchTerm"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading || !searchTerm}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c00",
          }}
        >
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div
          className="gif-results-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "12px",
            marginTop: "16px",
          }}
        >
          {results.map((result) => {
            const isSelected = selectedGifId === result.id;

            return (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelectGif(result)}
                className="gif-result-item"
                style={{
                  border: isSelected ? "3px solid #0066ff" : "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "4px",
                  cursor: "pointer",
                  backgroundColor: isSelected ? "#f0f8ff" : "white",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#999";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "#ddd";
                  }
                }}
              >
                <img
                  src={result.media_formats.tinygif.url}
                  alt="GIF preview"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "4px",
                  }}
                />
              </button>
            );
          })}
        </div>
      )}

      {!loading && results.length === 0 && searchTerm && !error && (
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            color: "#666",
          }}
        >
          No GIFs found for "{searchTerm}". Try a different search term.
        </div>
      )}

      {selectedGifId && (
        <div
          style={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#f0f8ff",
            border: "1px solid #0066ff",
            borderRadius: "4px",
            color: "#0066ff",
          }}
        >
          ✓ GIF selected (ID: {selectedGifId})
        </div>
      )}
    </div>
  );
};
