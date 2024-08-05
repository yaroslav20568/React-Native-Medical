import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsEmail } from 'class-validator';
import { Express } from 'multer';
import { Genders, Roles } from 'src/constants';

export class UserDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty({ enum: Genders, enumName: 'Genders' })
  gender: string;

  @IsString()
  @ApiProperty()
  typesUsers: string;

  @IsString()
  @ApiProperty()
  city: string;

	@ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.multer.file;

	@IsString()
  @ApiProperty({ enum: Roles, enumName: 'Roles' })
  role: string;
}

export class UserUpdateDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6, {
    message: 'Password is too short',
  })
  @ApiProperty({ required: false })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: Genders, enumName: 'Genders', required: false })
  gender: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  typesUsers: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  city: string;

	@ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.multer.file;

	@IsString()
  @IsOptional()
  @ApiProperty({ enum: Roles, enumName: 'Roles', required: false })
  role: string;
}