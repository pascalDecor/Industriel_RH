"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { mockValidateDocument, mockCorrectDocument } from '../services/validationService';

export interface Document {
  id: string;
  name: string;
  uploadDate: Date;
  size: number;
  type: string;
  status: 'pending' | 'validating' | 'compliant' | 'non-compliant';
  correctedVersion?: {
    url: string;
    generatedAt: Date;
  };
}

export interface ComplianceIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  section: string;
  lineNumber?: number;
  correction?: string;
}

export interface ValidationResult {
  documentId: string;
  status: 'compliant' | 'non-compliant';
  score: number;
  issues: ComplianceIssue[];
  validatedOn: Date;
}

interface ComplianceContextType {
  documents: Document[];
  validationResults: Record<string, ValidationResult>;
  uploadDocument: (file: File) => Promise<Document>;
  validateDocument: (documentId: string) => Promise<ValidationResult>;
  correctDocument: (documentId: string) => Promise<Document>;
  getDocument: (id: string) => Document | undefined;
  getValidationResult: (id: string) => ValidationResult | undefined;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};

interface ComplianceProviderProps {
  children: ReactNode;
}

export const ComplianceProvider = ({ children }: ComplianceProviderProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  const uploadDocument = async (file: File): Promise<Document> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDocument: Document = {
          id: Math.random().toString(36).substring(2, 11),
          name: file.name,
          uploadDate: new Date(),
          size: file.size,
          type: file.type,
          status: 'pending'
        };
        
        setDocuments(prev => [...prev, newDocument]);
        resolve(newDocument);
      }, 1500);
    });
  };

  const validateDocument = async (documentId: string): Promise<ValidationResult> => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId ? { ...doc, status: 'validating' } : doc
      )
    );

    const result = await mockValidateDocument(documentId);
    
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId ? { ...doc, status: result.status } : doc
      )
    );
    
    setValidationResults(prev => ({
      ...prev,
      [documentId]: result
    }));
    
    return result;
  };

  const correctDocument = async (documentId: string): Promise<Document> => {
    const document = documents.find(doc => doc.id === documentId);
    if (!document) throw new Error('Document not found');

    const correctedDoc = await mockCorrectDocument(documentId);
    
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, correctedVersion: correctedDoc.correctedVersion }
          : doc
      )
    );

    return correctedDoc;
  };

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const getValidationResult = (id: string) => {
    return validationResults[id];
  };

  return (
    <ComplianceContext.Provider value={{
      documents,
      validationResults,
      uploadDocument,
      validateDocument,
      correctDocument,
      getDocument,
      getValidationResult
    }}>
      {children}
    </ComplianceContext.Provider>
  );
};