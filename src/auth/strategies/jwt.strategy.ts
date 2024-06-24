import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt'
){
    constructor(config: ConfigService, @InjectModel(User.name) private userModel: Model<User>) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: config.get('JWT_SECRET')
      });
    }

    async validate(payload: {
      sub: number;
      username: string
    }) {
      const user = await this.userModel.findOne({_id: payload.sub})
      const userObj = user.toObject();
      delete userObj.password;
      
      return userObj;
    }
}
