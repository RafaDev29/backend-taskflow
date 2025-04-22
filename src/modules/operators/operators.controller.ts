import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { JwtRoleGuard } from '../auth/jwt/role.guard';


@UseGuards(JwtRoleGuard('ADMIN'))
@Controller('operators')
export class OperatorsController {
  constructor(private readonly operatorsService: OperatorsService) { }

  @Post('add')
  async create(@Body() dto: CreateOperatorDto, @Request() req) {
    const userId = req.user.userId; 
    return await this.operatorsService.create(dto, userId);
  }



  @Get('all')
  async findAll(@Request() req : any) {
    const userId = req.user.userId;
    return await this.operatorsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operatorsService.findOne(+id);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateOperatorDto>,
    @Request() req: any,
  ) {
    const userId = req.user.userId;
    return await this.operatorsService.update(+id, dto, userId);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return await this.operatorsService.remove(+id, userId);
  }
  
  
}
