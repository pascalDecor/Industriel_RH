import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';
import type { AuthApiUser } from '@/lib/auth-middleware';
import { 
  generateSecurePassword, 
  generateFirstLoginToken, 
  getTempPasswordExpiration, 
  getFirstLoginTokenExpiration 
} from '@/lib/password-utils';
import { sendWelcomeEmail } from '@/lib/email-service';
import { sendMail } from '@/lib/mail';
import prisma from '@/lib/connect_db';

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

    const user = authResult.user as AuthApiUser;

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
        lastLogin: dbUser.lastLogin || undefined,
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

    const currentUser = authResult.user as AuthApiUser;

    // Vérifier les permissions de création d'utilisateurs
    if (!hasPermission(currentUser, Permission.USERS_CREATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { name, email, role: roleCode } = await request.json();

    // Validation des données
    if (!name || !email || !roleCode) {
      return NextResponse.json(
        { error: 'Données manquantes (nom, email, rôle)' },
        { status: 400 }
      );
    }

    // Rôle en base (source de vérité pour les permissions)
    const roleRecord = await prisma.role.findUnique({
      where: { code: String(roleCode).trim().toUpperCase() }
    });
    if (!roleRecord) {
      return NextResponse.json(
        { error: 'Rôle non trouvé. Choisissez un rôle proposé par l\'application.' },
        { status: 400 }
      );
    }

    // Ne pas assigner un rôle de niveau supérieur ou égal au sien
    const currentLevel = currentUser.roleLevel ?? 0;
    if (roleRecord.level >= currentLevel) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas assigner un rôle de niveau supérieur ou égal au vôtre' },
        { status: 403 }
      );
    }

    // Pour UserRoleAssignment.role (enum), n'accepter que les codes présents dans l'enum
    const validRoleEnum = Object.values(UserRole).includes(roleCode as UserRole)
      ? (roleCode as UserRole)
      : null;
    if (!validRoleEnum) {
      return NextResponse.json(
        { error: 'Ce rôle ne peut pas être assigné à la création (référentiel en cours de migration).' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

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

    // Assigner le rôle via UserRoleAssignment (roleId = référentiel en base)
    await prisma.userRoleAssignment.create({
      data: {
        userId: newUser.id,
        role: validRoleEnum,
        roleId: roleRecord.id,
        isPrimary: true,
        isActive: true,
        assignedBy: currentUser.id
      }
    });

    // Envoyer l'email de bienvenue avec les identifiants
    const emailSent = await sendWelcomeEmail({
      name: newUser.name,
      email: newUser.email,
      role: validRoleEnum,
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
      role: validRoleEnum,
      isActive: newUser.isActive,
      lastLogin: newUser.lastLogin || undefined,
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