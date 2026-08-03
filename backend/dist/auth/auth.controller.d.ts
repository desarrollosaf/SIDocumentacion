import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { CambiarPasswordDto } from './dto/cambiar-password.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: AuthenticatedUser;
    }>;
    perfil(user: AuthenticatedUser): Promise<AuthenticatedUser>;
    cambiarPassword(user: AuthenticatedUser, dto: CambiarPasswordDto): Promise<{
        message: string;
    }>;
}
