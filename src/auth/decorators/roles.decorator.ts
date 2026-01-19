import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';

// roles decorators marks the routes with the roles that are allowed to access them.
// roles guard will later reads the metadata to check if the user has permission.

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
