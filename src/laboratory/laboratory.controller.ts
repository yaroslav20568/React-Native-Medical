import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { LaboratoryService } from './laboratory.service';
import { Laboratory } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, diskStorage } from 'multer';
import { LaboratoryDto, LaboratoryUpdateDto } from './dto/laboratory.dto';

@ApiTags('Laboratory')
@Controller()
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Get('laboratories')
  async getLaboratories(): Promise<Laboratory[]> {
    return this.laboratoryService.getLaboratories();
  }

  @Post('laboratory')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/laboratories',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  createLaboratory(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() laboratoryDto: LaboratoryDto,
  ): Promise<Laboratory> {
    return this.laboratoryService.createLaboratory(file, laboratoryDto);
  }

  @Delete('laboratory/:id')
  async deleteLaboratory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Laboratory> {
    return this.laboratoryService.deleteLaboratory(id);
  }

  @Put('laboratory/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/laboratories',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateLaboratory(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile('file') file: Express.Multer.File,
    @Body() laboratoryDto: LaboratoryUpdateDto,
  ): Promise<Laboratory> {
    return this.laboratoryService.updateLaboratory(id, file, laboratoryDto);
  }
}