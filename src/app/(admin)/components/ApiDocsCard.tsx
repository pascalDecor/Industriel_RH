"use client";

import { Card } from "@/components/ui/card";
import { FileText, ExternalLink, Code, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function ApiDocsCard() {
  const { hasInternalAccess, user } = useAuth();

  if (!hasInternalAccess) {
    return null; // Ne pas afficher si l'utilisateur n'a pas accès
  }

  return (
    <Card className="p-6 bg-linear-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 shadow-none border-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Code className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Documentation API</h3>
              <p className="text-sm text-muted-foreground">Accès sécurisé</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Interface Swagger pour explorer et tester les endpoints de l'API Industrielle RH. 
            Réservé au personnel technique et administratif.
          </p>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center text-xs text-muted-foreground">
              <Shield className="h-3 w-3 mr-1" />
              Accès protégé
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1" />
              OpenAPI 3.0
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href="/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Ouvrir la documentation
              <ExternalLink className="h-3 w-3 ml-2" />
            </Link>
            
            <Link
              href="/api/swagger"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-border text-foreground/80 text-sm font-medium rounded-lg hover:bg-white/50 transition-colors"
            >
              JSON
              <ExternalLink className="h-3 w-3 ml-2" />
            </Link>
          </div>
        </div>
        
        <div className="ml-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <Code className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/70">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Connecté en tant que: {user?.name}</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {user?.role}
          </span>
        </div>
      </div>
    </Card>
  );
}