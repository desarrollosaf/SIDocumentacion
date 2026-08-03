import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
export interface JwtPayload extends Omit<AuthenticatedUser, 'id'> {
    sub: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    validate(payload: JwtPayload): AuthenticatedUser;
}
export {};
