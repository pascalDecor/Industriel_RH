import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';
import { 
  generateSecurePassword, 
  generateFirstLoginToken, 
  getTempPasswordExpiration, 
  getFirstLoginTokenExpiration 
} from '@/lib/password-utils';
import { sendWelcomeEmail } from '@/lib/email-service';
import { sendMail } from '@/lib/mail';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = authResult.user as UserWithRole;

    // Vérifier les permissions de lecture des utilisateurs
    if (!hasPermission(user, Permission.USERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs avec leurs rôles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLogin: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          where: {
            isActive: true
          },
          select: {
            role: true,
            isPrimary: true
          },
          orderBy: {
            isPrimary: 'desc'
          }
        }
      },
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' }
      ]
    });

    // Transformer les données pour correspondre à UserWithRole
    const transformedUsers: UserWithRole[] = users.map(dbUser => {
      // Récupérer le rôle primaire ou le premier rôle actif
      const primaryRole = dbUser.userRoles.find(ur => ur.isPrimary) || dbUser.userRoles[0];
      
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: primaryRole?.role as UserRole || UserRole.CONSULTANT, // Fallback par défaut
        isActive: dbUser.isActive,
        lastLogin: dbUser.lastLogin,
        avatarUrl: dbUser.avatarUrl || undefined,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      total: transformedUsers.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = authResult.user as UserWithRole;

    // Vérifier les permissions de création d'utilisateurs
    if (!hasPermission(user, Permission.USERS_CREATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { name, email, role } = await request.json();

    // Validation des données
    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Vérifier si l'utilisateur peut assigner ce rôle
    // TODO: Implémenter la logique de vérification des rôles assignables

    // Générer un mot de passe temporaire sécurisé
    const tempPassword = await generateSecurePassword();
    const firstLoginToken = await generateFirstLoginToken();
    const tempPasswordExpires = await getTempPasswordExpiration();
    const firstLoginTokenExpires = await getFirstLoginTokenExpiration();

    // Hash du mot de passe temporaire
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
        mustChangePassword: true,
        tempPasswordExpires,
        firstLoginToken,
        firstLoginTokenExpires
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLogin: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Assigner le rôle via UserRoleAssignment
    await prisma.userRoleAssignment.create({
      data: {
        userId: newUser.id,
        role: role as UserRole,
        isPrimary: true,
        isActive: true
      }
    });

    // Envoyer l'email de bienvenue avec les identifiants
    const emailSent = await sendWelcomeEmail({
      name: newUser.name,
      email: newUser.email,
      role: role as UserRole,
      tempPassword,
      firstLoginToken
    });
    // Log si l'email n'a pas pu être envoyé

    if (!emailSent) {
      console.warn(`Utilisateur créé mais email de bienvenue non envoyé: ${newUser.email}`);
    }

    const transformedUser: UserWithRole = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: role as UserRole,
      isActive: newUser.isActive,
      lastLogin: newUser.lastLogin,
      avatarUrl: newUser.avatarUrl || undefined,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      user: transformedUser,
      emailSent
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}