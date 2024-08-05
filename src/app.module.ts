import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { TypeModule } from './type/type.module';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeUserModule } from './type-user/type-user.module';
import { LibraryArticleModule } from './library-article/library-article.module';
import { ArticleItemModule } from './library-item/library-item.module';

@Module({
  imports: [
    LaboratoryModule,
    TypeModule,
    CountryModule,
    CityModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    TypeUserModule,
    LibraryArticleModule,
    ArticleItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}