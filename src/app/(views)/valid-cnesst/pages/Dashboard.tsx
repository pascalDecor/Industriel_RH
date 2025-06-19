import React from 'react';
import { File, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCompliance } from '../context/ComplianceContext';
import Link from "next/link";

const DashboardCNESST = () => {
  const { t } = useLanguage();
  const { documents } = useCompliance();

  // Count documents by status
  const compliantCount = documents.filter(doc => doc.status === 'compliant').length;
  const nonCompliantCount = documents.filter(doc => doc.status === 'non-compliant').length;
  const pendingCount = documents.filter(doc => doc.status === 'pending' || doc.status === 'validating').length;

  // Get recent documents, sorted by upload date
  const recentDocuments = [...documents]
    .sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboardTitle')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('dashboardDescription')}</p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('compliantDocuments')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{compliantCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('nonCompliantDocuments')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{nonCompliantCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{t('pendingDocuments')}</dt>
                  <dd className="text-3xl font-semibold text-gray-900">{pendingCount}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent documents */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{t('recentDocuments')}</h3>
        </div>

        {recentDocuments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentDocuments.map(document => (
              <li key={document.id}>
                <Link
                  href={`/report/${document.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-gray-400 mr-3" />
                        <p className="text-sm font-medium text-blue-600 truncate">{document.name}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <StatusBadge status={document.status} />
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {new Date(document.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-5 text-center text-gray-500 sm:px-6">
            <p>{t('noDocumentsYet')}</p>
            <Link
              href="/upload"
              className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
            >
              {t('uploadFirst')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let bgColor, textColor, label;

  switch (status) {
    case 'compliant':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Conforme';
      break;
    case 'non-compliant':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Non conforme';
      break;
    case 'validating':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'En validation';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'En attente';
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default DashboardCNESST;