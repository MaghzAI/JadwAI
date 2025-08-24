export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          emailVerified: string | null
          image: string | null
          password: string | null
          role: 'USER' | 'ADMIN' | 'MANAGER' | 'VIEWER'
          language: string
          theme: string
          phone: string | null
          company: string | null
          location: string | null
          bio: string | null
          avatar: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name?: string | null
          email: string
          emailVerified?: string | null
          image?: string | null
          password?: string | null
          role?: 'USER' | 'ADMIN' | 'MANAGER' | 'VIEWER'
          language?: string
          theme?: string
          phone?: string | null
          company?: string | null
          location?: string | null
          bio?: string | null
          avatar?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          emailVerified?: string | null
          image?: string | null
          password?: string | null
          role?: 'USER' | 'ADMIN' | 'MANAGER' | 'VIEWER'
          language?: string
          theme?: string
          phone?: string | null
          company?: string | null
          location?: string | null
          bio?: string | null
          avatar?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          industry: string | null
          location: string | null
          currency: string
          userId: string
          status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          industry?: string | null
          location?: string | null
          currency?: string
          userId: string
          status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          industry?: string | null
          location?: string | null
          currency?: string
          userId?: string
          status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
          createdAt?: string
          updatedAt?: string
        }
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      UserRole: 'USER' | 'ADMIN' | 'MANAGER' | 'VIEWER'
      ProjectStatus: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
      StudyType: 'TECHNICAL' | 'ECONOMIC' | 'LEGAL' | 'OPERATIONAL' | 'COMPREHENSIVE'
      StudyStatus: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'PUBLISHED'
      StageStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED'
      MilestoneStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
      TaskStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
      Priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      TeamRole: 'OWNER' | 'MANAGER' | 'MEMBER' | 'VIEWER'
      DocumentCategory: 'PROPOSAL' | 'CONTRACT' | 'REPORT' | 'PRESENTATION' | 'IMAGE' | 'OTHER'
      NotificationType: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'REMINDER'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
