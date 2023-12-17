import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { Express } from 'multer';
import { Regions } from 'src/constants';

export class LaboratoryDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ default: 1 })
  cityId: number;

  @IsString()
  @ApiProperty({ enum: Regions, enumName: 'Regions' })
  region: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  coordinates: string;

  @IsString()
  @ApiProperty()
  phone: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  socialNetwork: string;

  @IsString()
  @ApiProperty()
  linkWebsite: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  addInfo: string;

  @IsString()
  @ApiProperty()
  workingHours: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ default: 1 })
  typeId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.multer.file;

  @IsString()
  @ApiProperty()
  typesUsers: string;
}

export class LaboratoryUpdateDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  name: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ default: 1, required: false })
  cityId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ enum: Regions, enumName: 'Regions', required: false })
  region: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  coordinates: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  socialNetwork: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  linkWebsite: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  addInfo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  workingHours: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ default: 1, required: false })
  typeId: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.multer.file;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  typesUsers: string;
}
