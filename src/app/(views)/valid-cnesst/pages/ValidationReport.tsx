import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useParams, useRouter } from 'next/navigation'
import {
  File, AlertTriangle, CheckCircle, Info, Download, Share2,
  ChevronDown, ChevronUp, ArrowLeft, Wand2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCompliance, ValidationResult, ComplianceIssue } from '../context/ComplianceContext';

const ValidationReport = () => {

  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  // const navigate = useNavigate();
  const { t } = useLanguage();
  const { getDocument, getValidationResult, validateDocument, correctDocument } = useCompliance();

  const [isValidating, setIsValidating] = useState(false);
  const [isGeneratingCorrection, setIsGeneratingCorrection] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const document = getDocument(id || '');
  const validationResult = getValidationResult(id || '');

  useEffect(() => {
    if (!document) {
      router.push('/');
    }
  }, [document, router]);

  useEffect(() => {
    const handleValidation = async () => {
      if (document && (document.status === 'pending' || document.status === 'validating') && !validationResult && !isValidating) {
        setIsValidating(true);
        await validateDocument(document.id);
        setIsValidating(false);
      }
    };

    handleValidation();
  }, [document, validationResult, validateDocument, isValidating]);

  const handleCorrection = async () => {
    if (!document) return;

    setIsGeneratingCorrection(true);
    try {
      const correctedDoc = await correctDocument(document.id);
      if (correctedDoc.correctedVersion?.url) {
        if (window !== undefined) {
          window.open(correctedDoc.correctedVersion.url, '_blank');
        }
      }
    } catch (error) {
      console.error('Error generating correction:', error);
    }
    setIsGeneratingCorrection(false);
  };

  if (!document) {
    return null;
  }

  const issuesBySection: Record<string, ComplianceIssue[]> = {};
  if (validationResult) {
    validationResult.issues.forEach(issue => {
      if (!issuesBySection[issue.section]) {
        issuesBySection[issue.section] = [];
      }
      issuesBySection[issue.section].push(issue);
    });
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-orange-700 bg-orange-100';
      case 'low': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('backToDashboard')}
      </button>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="bg-blue-50 px-4 py-5 border-b border-blue-100 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{document.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {t('uploadedOn')} {new Date(document.uploadDate).toLocaleDateString()}
            </p>
          </div>

          {validationResult && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCorrection}
                disabled={isGeneratingCorrection}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGeneratingCorrection ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGeneratingCorrection ? t('generatingCorrection') : t('autoCorrect')}
              </button>

              {document.correctedVersion && (
                <a
                  href={document.correctedVersion.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t('downloadCorrected')}
                </a>
              )}

              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-1" />
                {t('share')}
              </button>
            </div>
          )}
        </div>

        {!validationResult ? (
          <div className="px-4 py-12 sm:px-6 text-center">
            <div className="animate-pulse flex flex-col items-center justify-center">
              <div className="rounded-full bg-blue-100 p-3 mb-4">
                <File className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isValidating ? t('validatingDocument') : t('waitingForValidation')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{t('validationInProgress')}</p>

              <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full animate-progressBar"></div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{t('validationResults')}</h3>

                <div className={`px-3 py-1 rounded-full text-sm font-medium
                  ${validationResult.status === 'compliant'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'}`
                }>
                  {validationResult.status === 'compliant' ? t('compliant') : t('nonCompliant')}
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${validationResult.score >= 75 ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    style={{ width: `${validationResult.score}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{t('complianceScore')}</span>
                  <span className="text-xs font-medium">{validationResult.score}%</span>
                </div>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6">
              {validationResult.issues.length === 0 ? (
                <div className="py-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">{t('fullyCompliant')}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t('noIssuesFound')}</p>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    {t('issuesFound')} {t({ count: validationResult.issues.length } as any)}
                  </h4>

                  {Object.entries(issuesBySection).map(([section, issues]) => (
                    <div key={section} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between"
                        onClick={() => toggleSection(section)}
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium text-gray-900">{section}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ({issues.length} {issues.length === 1 ? t('issue') : t('issues')})
                          </span>
                        </div>
                        {expandedSections[section] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {expandedSections[section] && (
                        <div className="px-4 py-3 border-t border-gray-200">
                          {issues.map(issue => (
                            <div key={issue.id} className="mb-4 last:mb-0">
                              <div className="flex items-start">
                                <div className={`px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${severityColor(issue.severity)}`}>
                                  {issue.severity === 'high' ? t('highSeverity') :
                                    issue.severity === 'medium' ? t('mediumSeverity') : t('lowSeverity')}
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="text-sm font-medium text-gray-900">{issue.description}</p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    <span className="font-medium">{t('recommendation')}:</span> {issue.recommendation}
                                  </p>
                                  {issue.correction && (
                                    <p className="mt-1 text-sm text-green-600">
                                      <span className="font-medium">{t('suggestedCorrection')}:</span> {issue.correction}
                                    </p>
                                  )}
                                  {issue.lineNumber && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      {t('line')} {issue.lineNumber}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {validationResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">{t('whatNext')}</h4>
            <p className="mt-1 text-sm text-blue-600">{t('nextStepsInfo')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationReport;