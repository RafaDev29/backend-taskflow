import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtRoleGuard } from '../auth/jwt/role.guard';
import { OperatorUpdateTaskDto } from './dto/operator-update-task.dto';



@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }
  @UseGuards(JwtRoleGuard('ADMIN'))
  @Post('add')
  async create(@Body() dto: CreateTaskDto, @Request() req: any) {
    const userId = req.user.userId;
    return await this.taskService.create(dto, userId);
  }

  @UseGuards(JwtRoleGuard('ADMIN'))
  @Get('all')
  async findAll(@Request() req: any) {
    const userId = req.user.userId;
    return await this.taskService.findAll(userId);
  }

  @UseGuards(JwtRoleGuard('OPERATOR'))
  @Get('asig')
  async findMyTasks(@Request() req: any) {
    const userId = req.user.userId;
    return await this.taskService.findMyTasks(userId);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @UseGuards(JwtRoleGuard('ADMIN'))
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Request() req: any
  ) {
    const userId = req.user.userId;
    return await this.taskService.update(+id, dto, userId);
  }
  

  @UseGuards(JwtRoleGuard('ADMIN'))
  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.userId;
    return await this.taskService.remove(+id, userId);
  }

  @UseGuards(JwtRoleGuard('OPERATOR'))
@Patch('update-state/:id')
async operatorUpdateState(
  @Param('id') id: string,
  @Body() dto: OperatorUpdateTaskDto,
  @Request() req: any
) {
  const userId = req.user.userId;
  return await this.taskService.operatorUpdateState(+id, dto.state, userId);
}

  
}
