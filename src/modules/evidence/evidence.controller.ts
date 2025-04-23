import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  
  @Post('upload')
  @UseInterceptors(FilesInterceptor('photos'))
  async upload(
    @UploadedFiles() files: File[],
    @Body() dto: CreateEvidenceDto,
  ) {
    return this.evidenceService.uploadMany(files, dto);
  }

  @Get('by-task/:id')
  async findByTask(@Param('id') id: string) {
    return this.evidenceService.findByTask(+id);
  }
  

  @Post()
  create(@Body() createEvidenceDto: CreateEvidenceDto) {
    return this.evidenceService.create(createEvidenceDto);
  }

  @Get()
  findAll() {
    return this.evidenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evidenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvidenceDto: UpdateEvidenceDto) {
    return this.evidenceService.update(+id, updateEvidenceDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.evidenceService.remove(+id);
  }
  
}
