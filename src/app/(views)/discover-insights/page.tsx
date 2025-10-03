
"use client";

import { imagePathFinder } from "@/utils/imagePathFinder";
import Image from 'next/image';
import Button from "@/components/ui/button";
import LazyImage from "@/components/ui/LazyImage";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelSelect from "@/components/ui/select";
import { useTranslation } from "@/contexts/LanguageContext";;
import { useDateLanguage } from "@/hooks/useDateLanguage";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";
import EditorContent from "@/components/ui/editorContent";
import MultiSelect from "@/components/ui/multiSelect";


interface ArticleData {
  id: string;
  titre: string;
  titre_en?: string;
  image: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  contenu?: any;
  contenu_en?: any;
  tags: Array<{ id: string; libelle: string; libelle_en?: string }>;
  specialites: Array<{ id: string; libelle: string; libelle_en?: string }>;
  author?: { id: string; name: string };
}

interface FilterElementsProps {
  id: number,
  label: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: string[];
}


export default function DiscoverInsights() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { translateArticleTitle, translateSpecialty, translateTag, translateArticleContent } = useDynamicTranslation();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<Array<{ id: string; libelle: string; libelle_en?: string }>>([]);
  const [specialites, setSpecialites] = useState<Array<{ id: string; libelle: string; libelle_en?: string }>>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    tags: string[];
    specialites: string[];
  }>({ tags: [], specialites: [] });

  useDateLanguage();

  useEffect(() => {
    fetchArticles();
    fetchFeaturedArticles();
    fetchFiltersData();
  }, []);

  const fetchArticles = async (filters?: { tags: string[]; specialites: string[] }) => {
    try {
      setLoading(true);
      const currentFilters = filters || selectedFilters;

      const queryParams = new URLSearchParams({
        published: 'true',
        limit: '12',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        includeContent: 'true'
      });

      if (currentFilters.tags.length > 0) {
        queryParams.append('tags', currentFilters.tags.join(','));
      }
      if (currentFilters.specialites.length > 0) {
        queryParams.append('specialites', currentFilters.specialites.join(','));
      }

      const url = `/api/articles?${queryParams.toString()}`;
      console.log('Fetching articles with URL:', url);
      console.log('Applied filters:', currentFilters);

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        console.log('Articles received:', data.data?.length || 0, 'articles');
        console.log('API Response success:', data);
        setArticles(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('API response error:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedArticles = async () => {
    try {
      const response = await fetch('/api/articles?published=true&limit=3&sortBy=views&sortOrder=desc&includeContent=true');
      if (response.ok) {
        const data = await response.json();
        setFeaturedArticles(data.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles mis en avant:', error);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const [tagsResponse, specialitesResponse] = await Promise.all([
        fetch('/api/tags'),
        fetch('/api/specialites')
      ]);

      if (tagsResponse.ok) {
        const tagsData = await tagsResponse.json();
        setTags(tagsData.data || []);
      }

      if (specialitesResponse.ok) {
        const specialitesData = await specialitesResponse.json();
        setSpecialites(specialitesData.data || []);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des filtres:', error);
    }
  };

  useEffect(() => {
    console.log('Filters changed, fetching articles...', selectedFilters);
    fetchArticles();
  }, [selectedFilters]);

  const handleFilterChange = (type: 'tags' | 'specialites', value: string, checked: boolean) => {
    console.log('Filter change:', { type, value, checked });

    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [type]: checked
          ? [...prev[type], value]
          : prev[type].filter(item => item !== value)
      };
      console.log('New filters state:', newFilters);

      // Appeler fetchArticles directement avec les nouveaux filtres
      // pour éviter les délais de setState
      setTimeout(() => {
        fetchArticles(newFilters);
      }, 0);

      return newFilters;
    });
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/discover-insights/article/${articleId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  const getArticleDescription = (article: ArticleData): string => {
    if (article.contenu) {
      try {
        const content = Array.isArray(article.contenu) ? article.contenu[0] : article.contenu;
        if (content && content.blocks && Array.isArray(content.blocks)) {
          const textBlock = content.blocks.find((block: any) =>
            block.type === 'paragraph' && block.data && block.data.text
          );

          if (textBlock) {
            const cleanText = textBlock.data.text.replace(/<[^>]*>/g, '').trim();
            return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
          }
        }
      } catch (error) {
        console.warn('Erreur lors de l\'extraction de la description:', error);
      }
    }

    const tags = article.tags.slice(0, 2).map(tag => translateTag(tag)).join(', ');
    return `${tags} • ${article.views} ${t('common.views')}`;
  };

  function handleClick() {
    console.log("Clic !");
  }

  const [showTagsFilter, setShowTagsFilter] = useState(false);
  const [showSpecialitesFilter, setShowSpecialitesFilter] = useState(false);

  useEffect(() => {
    setShowTagsFilter(window.innerWidth >= 1024);
  }, []);

  // Newsletter subscription form state
  const [newsletterForm, setNewsletterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    areasOfInterest: [] as string[]
  });
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Newsletter form handlers
  const handleNewsletterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsletterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewsletterSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewsletterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewsletterMultiSelectChange = (selectedOptions: Array<{ label: string; value: string }>) => {
    setNewsletterForm(prev => ({
      ...prev,
      areasOfInterest: selectedOptions.map(option => option.value)
    }));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!newsletterForm.firstName || !newsletterForm.lastName || !newsletterForm.email) {
      setNewsletterStatus('error');
      return;
    }

    setIsSubmittingNewsletter(true);
    setNewsletterStatus('idle');

    try {
      const response = await fetch('/api/newsletters/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newsletterForm.firstName,
          lastName: newsletterForm.lastName,
          email: newsletterForm.email,
          areasOfInterest: newsletterForm.areasOfInterest
        })
      });

      if (response.ok) {
        setNewsletterStatus('success');
        // Reset form
        setNewsletterForm({
          firstName: '',
          lastName: '',
          email: '',
          areasOfInterest: []
        });
      } else {
        setNewsletterStatus('error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription à la newsletter:', error);
      setNewsletterStatus('error');
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };


  return <>
    {/* Own the future of your work */}
    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 mt-10">
        <div className="lg:col-span-3 lg:pr-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text mb-5 sm:mb-14 text-gray-800">
            {t('discover_insights.hero.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('discover_insights.hero.description')}
          </p>
        </div>
        <div className="lg:col-span-2">
          <Image loading="lazy" src={imagePathFinder.own_the_future_of_your_work} alt={t('discover_insights.hero.alt')} />
        </div>
      </div>
    </section>
    {/* Articles en vedette */}
    <section className="mx-auto w-full mb-10 px-4 md:px-6 lg:px-10 py-10">
      <h2 className="text-2xl sm:text-3xl font-semibold text mb-10 md:mb-20 text-black text-center">
        {t('discover_insights.featured.title')}
      </h2>

      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
        {featuredArticles.length > 0 ? (
          featuredArticles.slice(0, 3).map((article, index) => (
            <div key={article.id} className="w-full">
              <div
                className="bg-white rounded-lg p-0 shadow-xl overflow-hidden h-full cursor-pointer hover:shadow-2xl transition-shadow"
                onClick={() => handleArticleClick(article.id)}
              >
                <LazyImage
                  src={article.image || '/images/default-article.jpg'}
                  alt={article.titre}
                  width={400}
                  height={250}
                  className="w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-regular text-blue-900 font-bold mb-5 line-clamp-2">
                    {translateArticleTitle(article)}
                  </p>
                  <div className="text-sm font-regular text-gray-500 line-clamp-3">
                    <EditorContent content={translateArticleContent(article)} />
                  </div>
                  {/* <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                        >
                          {translateTag(tag)}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {article.views} {t('common.views')}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Loading placeholder avec animate-pulse si pas d'articles dynamiques
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-full">
                <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden h-full animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-5 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>


    {/* Articles avec filtres */}
    <div className="absolute -mt-400" id="refine_your_focus"></div>
    <section className="mx-auto w-full mb-10 px-4 md:px-6 lg:px-10 py-10 bg-gray-200 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold text my-6 md:my-10 text-black text-center">
        {t('discover_insights.articles.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Filtres */}
        <div className="lg:col-span-3 text-left">
          <div className="bg-white p-4 md:p-6 rounded-xl overflow-hidden mb-4 lg:sticky lg:top-24">
            <p className="font-regular text-blue-900 font-bold mb-5 uppercase">
              {t('discover_insights.filters.title')}
            </p>

            {/* Filtres par Tags */}
            <div className="mb-6">
              <div
                className="flex gap-4 items-center justify-between mb-3 cursor-pointer"
                onClick={() => setShowTagsFilter(!showTagsFilter)}
              >
                <p className={`text-sm font-bold ${showTagsFilter ? "text-gray-900" : "text-gray-600"}`}>
                  {t('discover_insights.filters.tags')}
                </p>
                {showTagsFilter ?
                  <FaArrowUp className="text-gray-900 text-lg" /> :
                  <FaArrowDown className="text-gray-600 text-lg" />
                }
              </div>
              {showTagsFilter && (
                <div className="space-y-2 mb-4">
                  {tags.slice(0, 8).map((tag) => (
                    <div className="flex gap-2 items-center" key={tag.id}>
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedFilters.tags.includes(tag.id)}
                        onChange={(e) => handleFilterChange('tags', tag.id, e.target.checked)}
                        className="w-4 h-4 text-blue-900 bg-gray-100 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`tag-${tag.id}`} className="text-sm text-gray-500 cursor-pointer">
                        {translateTag(tag)}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <hr className="my-4" />
            </div>

            {/* Filtres par Spécialités */}
            <div className="mb-6">
              <div
                className="flex gap-4 items-center justify-between mb-3 cursor-pointer"
                onClick={() => setShowSpecialitesFilter(!showSpecialitesFilter)}
              >
                <p className={`text-sm font-bold ${showSpecialitesFilter ? "text-gray-900" : "text-gray-600"}`}>
                  {t('discover_insights.filters.specialties')}
                </p>
                {showSpecialitesFilter ?
                  <FaArrowUp className="text-gray-900 text-lg" /> :
                  <FaArrowDown className="text-gray-600 text-lg" />
                }
              </div>
              {showSpecialitesFilter && (
                <div className="space-y-2 mb-4">
                  {specialites.slice(0, 8).map((specialite) => (
                    <div className="flex gap-2 items-center" key={specialite.id}>
                      <input
                        type="checkbox"
                        id={`spec-${specialite.id}`}
                        checked={selectedFilters.specialites.includes(specialite.id)}
                        onChange={(e) => handleFilterChange('specialites', specialite.id, e.target.checked)}
                        className="w-4 h-4 text-blue-900 bg-gray-100 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`spec-${specialite.id}`} className="text-sm text-gray-500 cursor-pointer">
                        {translateSpecialty(specialite)}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <hr className="my-4" />
            </div>

            {/* Bouton reset filtres */}
            {(selectedFilters.tags.length > 0 || selectedFilters.specialites.length > 0) && (
              <div className="flex justify-center">
                <Button
                  variant="dark"
                  size="md"
                  onClick={() => {
                    console.log('Clearing all filters');
                    const clearedFilters = { tags: [], specialites: [] };
                    setSelectedFilters(clearedFilters);
                    fetchArticles(clearedFilters);
                  }}
                  className="text-sm !rounded-full px-6 py-3"
                >
                  {t('discover_insights.filters.clear')} ({selectedFilters.tags.length + selectedFilters.specialites.length})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Articles dynamiques */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className={`bg-gray-200 rounded mb-4 ${index % 3 === 0 ? 'h-48' : index % 3 === 1 ? 'h-40' : 'h-52'}`}></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 9).map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleArticleClick(article.id)}
                  >
                    <LazyImage
                      src={article.image || '/images/default-article.jpg'}
                      alt={article.titre}
                      width={300}
                      height={200}
                      className="w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-sm text-start font-bold text-blue-900 mb-3 line-clamp-2">
                        {translateArticleTitle(article)}
                      </h3>
                      <p className="text-sm text-start text-gray-500 line-clamp-3 mb-3">
                        {getArticleDescription(article)}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex flex-wrap gap-1">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                            >
                              {translateTag(tag)}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {article.views} {t('common.views')}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {articles.length > 9 && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {/* Charger plus d'articles */ }}
                    className="rounded-full"
                  >
                    {t('discover_insights.load_more')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {t('discover_insights.no_articles')}
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  const clearedFilters = { tags: [], specialites: [] };
                  setSelectedFilters(clearedFilters);
                  fetchArticles(clearedFilters);
                }}
              >
                {t('discover_insights.filters.clear')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>

    {/* Newsletter CTA */}
    <section className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="w-full bg-blue-900 bg-[url(/images/bg_blue.png)] bg-cover bg-center py-10 md:py-15 px-6 md:px-12 lg:px-20 rounded-2xl md:rounded-4xl border">
        <p className="font-medium text-xl md:text-3xl text-center mb-4 text-white">
          {t('discover_insights.newsletter.title')}
        </p>

        <div className="flex mt-5 align-center items-center mx-auto w-fit">
          <Button
            variant="dark"
            size="md"
            onClick={() => {
              const element = document.getElementById('newsletter-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="!rounded-full px-8 md:px-10 py-3 text-sm mx-auto mt-6 md:mt-10 w-fit whitespace-nowrap"
          >
            {t('discover_insights.newsletter.cta')}
          </Button>
        </div>
      </div>
    </section>

    {/* Newsletter Subscription */}
    <section id="newsletter-section" className="mx-auto max-w-5xl mb-10 px-4 md:px-6 lg:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 md:gap-8 mt-10">
        <div className="lg:pl-4">
          <h2 className="text-2xl md:text-3xl font-semibold text mb-6 md:mb-14 text-gray-800">
            {t('discover_insights.subscription.title')}
          </h2>
          <p className="text-gray-500 text-sm mb-5">
            {t('discover_insights.subscription.description')}
          </p>
        </div>

        <div className="w-full">
          <div className="bg-blue-900 px-6 md:px-10 py-5 rounded-3xl border max-w-3xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text mb-6 md:mb-10 mt-5 text-white text-center">
              {t('discover_insights.subscription.form_title')}
            </h2>

            {/* Success Message */}
            {newsletterStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="text-sm font-medium text-center">
                  {t('discover_insights.subscription.success_message')}
                </p>
              </div>
            )}

            {/* Error Message */}
            {newsletterStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="text-sm font-medium text-center">
                  {t('discover_insights.subscription.error_message')}
                </p>
              </div>
            )}

            <form onSubmit={handleNewsletterSubmit} className="grid grid-cols-12 gap-4 w-full mb-10">
              <div className="col-span-12">
                <FloatingLabelInput
                  type="text"
                  name="firstName"
                  label={t('common.first_name')}
                  placeholder={t('common.first_name')}
                  value={newsletterForm.firstName}
                  onChange={handleNewsletterInputChange}
                  required
                />
              </div>
              <div className="col-span-12">
                <FloatingLabelInput
                  type="text"
                  name="lastName"
                  label={t('common.last_name')}
                  placeholder={t('common.last_name')}
                  value={newsletterForm.lastName}
                  onChange={handleNewsletterInputChange}
                  required
                />
              </div>
              <div className="col-span-12 text-left">
                <FloatingLabelInput
                  type="email"
                  name="email"
                  label={t('common.email')}
                  placeholder={t('common.email')}
                  value={newsletterForm.email}
                  onChange={handleNewsletterInputChange}
                  required
                />
              </div>
              <div className="col-span-12 text-left">
                <p className="text-white font-medium text-sm">
                  {t('discover_insights.subscription.interests')}
                </p>
              </div>
              <div className="col-span-12 text-left mb-5 bg-white  rounded-2xl">
                <MultiSelect

                  items={specialites.map(spec => ({
                    label: translateSpecialty(spec),
                    value: spec.id
                  }))}
                  defaultValue={newsletterForm.areasOfInterest.map(id => {
                    const spec = specialites.find(spec => spec.id === id);
                    return spec ? {
                      label: translateSpecialty(spec),
                      value: id
                    } : { label: '', value: id };
                  })}
                  onChange={handleNewsletterMultiSelectChange}
                  placeholder={t('discover_insights.subscription.areas_label')}
                  className="text-black"
                />
              </div>
              <div className="col-span-12 text-center">
                <Button
                  type="submit"
                  variant="dark"
                  size="md"
                  disabled={isSubmittingNewsletter}
                  className="!rounded-full text-sm px-20 mx-auto"
                >
                  {isSubmittingNewsletter ? t('common.submitting') : t('common.submit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

  </>
}