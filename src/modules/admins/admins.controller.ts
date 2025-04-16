import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtRoleGuard } from '../auth/jwt/role.guard';


@UseGuards(JwtRoleGuard('ROOT'))
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  @Post('add')
  async create(@Body() dto: CreateAdminDto) {
    return await this.adminsService.create(dto);

  }

  @Get('all')
  async findAll() {
    return await this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return await this.adminsService.update(+id, dto);
  
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.adminsService.remove(+id);
   
  }
}
