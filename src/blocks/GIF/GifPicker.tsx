"use client";

import {
  Button,
  FieldLabel,
  TextInput,
  useForm,
  useFormFields,
} from "@payloadcms/ui";
import type React from "react";
import { useCallback, useEffect, useState } from "react";

import { extractVideoUrls, searchGifs } from "./actions";

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
  // Field paths for storing video URLs directly
  const mp4UrlFieldPath = "mp4Url";
  const webmUrlFieldPath = "webmUrl";
  const posterUrlFieldPath = "posterUrl";
  const aspectRatioFieldPath = "aspectRatio";

  // Form integration
  const { dispatchFields } = useForm();

  // Read existing field values to check if GIF is already selected
  const existingMp4Url = useFormFields(
    ([fields]) => fields[mp4UrlFieldPath]?.value as string | undefined
  );
  const existingPosterUrl = useFormFields(
    ([fields]) => fields[posterUrlFieldPath]?.value as string | undefined
  );

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<TenorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGifId, setSelectedGifId] = useState<string | null>(null);
  const [showSearchMode, setShowSearchMode] = useState(false);

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
    async (result: TenorResult) => {
      // Extract video URLs and metadata
      const videoData = await extractVideoUrls(result);

      // Update form fields with video URLs
      dispatchFields({
        type: "UPDATE",
        path: mp4UrlFieldPath,
        value: videoData.mp4Url,
      });

      dispatchFields({
        type: "UPDATE",
        path: webmUrlFieldPath,
        value: videoData.webmUrl || null,
      });

      dispatchFields({
        type: "UPDATE",
        path: posterUrlFieldPath,
        value: videoData.posterUrl,
      });

      dispatchFields({
        type: "UPDATE",
        path: aspectRatioFieldPath,
        value: videoData.aspectRatio,
      });

      // Mark as selected, close search, and switch to preview mode
      setSelectedGifId(result.id);
      setResults([]);
      setSearchTerm("");
      setShowSearchMode(false);
    },
    [dispatchFields]
  );

  const handleChangeGif = useCallback(() => {
    setShowSearchMode(true);
    setSelectedGifId(null);
  }, []);

  const handleRemoveGif = useCallback(() => {
    // Clear all GIF fields
    dispatchFields({ type: "UPDATE", path: mp4UrlFieldPath, value: null });
    dispatchFields({ type: "UPDATE", path: webmUrlFieldPath, value: null });
    dispatchFields({ type: "UPDATE", path: posterUrlFieldPath, value: null });
    dispatchFields({ type: "UPDATE", path: aspectRatioFieldPath, value: null });
    setShowSearchMode(false);
    setSelectedGifId(null);
  }, [dispatchFields]);

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
  const DEBOUNCE_DELAY_MS = 500;
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length === 0) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearch();
    }, DEBOUNCE_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm, handleSearch]);

  // Determine if we should show preview mode
  const hasExistingGif = existingMp4Url && existingPosterUrl;
  const shouldShowPreview = hasExistingGif && !showSearchMode;

  // Preview URL
  const previewUrl = existingPosterUrl;

  // Render
  return (
    <div className="field-type gif-picker">
      {shouldShowPreview ? (
        // Preview Mode: Show selected GIF
        <>
          <FieldLabel label="Selected GIF" />
          <div
            style={{
              marginBottom: "16px",
              padding: "12px",
              border: "1px solid var(--theme-elevation-150)",
              borderRadius: "4px",
              backgroundColor: "var(--theme-elevation-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "120px",
                flexShrink: 0,
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              {previewUrl ? (
                // biome-ignore lint/performance/noImgElement: Payload admin component cannot use Next.js Image
                <img
                  alt="Selected GIF preview"
                  height={120}
                  src={previewUrl}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                  width={120}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--theme-elevation-100)",
                    color: "var(--theme-elevation-500)",
                    fontSize: "12px",
                  }}
                >
                  Loading...
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button onClick={handleChangeGif}>Change GIF</Button>
              <Button buttonStyle="secondary" onClick={handleRemoveGif}>
                Remove GIF
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Search Mode: Show Tenor search interface
        <>
          <FieldLabel label="Search Tenor GIFs" />

          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <TextInput
                onChange={(e: string | React.ChangeEvent<HTMLInputElement>) => {
                  if (typeof e === "string") {
                    setSearchTerm(e);
                  } else if (e?.target?.value !== undefined) {
                    setSearchTerm(e.target.value);
                  }
                }}
                onKeyDown={handleKeyPress}
                path="gifSearchTerm"
                placeholder="Search for GIFs..."
                value={searchTerm}
              />
            </div>
            <Button disabled={loading || !searchTerm} onClick={handleSearch}>
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
                    className="gif-result-item"
                    key={result.id}
                    onClick={() => handleSelectGif(result)}
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
                    style={{
                      border: isSelected
                        ? "3px solid #0066ff"
                        : "2px solid #ddd",
                      borderRadius: "8px",
                      padding: "4px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#f0f8ff" : "white",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                    type="button"
                  >
                    {/* biome-ignore lint/performance/noImgElement: Payload admin component cannot use Next.js Image */}
                    <img
                      alt="GIF preview"
                      height={result.media_formats.tinygif.dims[1]}
                      src={result.media_formats.tinygif.url}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        borderRadius: "4px",
                      }}
                      width={result.media_formats.tinygif.dims[0]}
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
        </>
      )}
    </div>
  );
};
