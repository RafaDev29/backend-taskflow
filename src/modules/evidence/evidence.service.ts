import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Evidence } from './entities/evidence.entity';
import { Repository } from 'typeorm';
import { Task } from '../task/entities/task.entity';
import { File } from 'multer';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class EvidenceService {

  private s3: S3Client;
  private bucket: string;

  constructor(
    @InjectRepository(Evidence)
    private evidenceRepo: Repository<Evidence>,

    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    private configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('MINIO_REGION') || '',
      endpoint: this.configService.get<string>('MINIO_ENDPOINT') || '',
      credentials: {
        accessKeyId: this.configService.get<string>('MINIO_ACCESS_KEY') || '',
        secretAccessKey: this.configService.get<string>('MINIO_SECRET_KEY') || '',
      },
      forcePathStyle: true,
    });
    
    this.bucket = this.configService.get<string>('MINIO_BUCKET') || '';
    
  }

 async uploadMany(files: File[], dto: CreateEvidenceDto) {
  const task = await this.taskRepo.findOneBy({ taskId: dto.taskId });
  if (!task) throw new NotFoundException('Tarea no encontrada');

  const evidences: Evidence[] = [];

  for (const file of files) {
    const key = `task-${dto.taskId}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    const url = `${this.configService.get<string>('MINIO_ENDPOINT')}/${this.bucket}/${key}`;

    const evidence = this.evidenceRepo.create({
      photo: url,
      latitude: dto.latitude,
      longitude: dto.longitude,
      task: { taskId: dto.taskId },
    });

    const saved = await this.evidenceRepo.save(evidence);
    evidences.push(saved);
  }

  return evidences;
}

async findByTask(taskId: number) {
  const evidences = await this.evidenceRepo.find({
    where: { task: { taskId } },
    order: { createdAt: 'DESC' }, 
  });

  return evidences;
}



async remove(id: number) {
  const evidence = await this.evidenceRepo.findOneBy({ evidenceId: id });

  if (!evidence) {
    throw new NotFoundException('Evidencia no encontrada');
  }

  const fileUrl = evidence.photo;
  const key = fileUrl.replace(`${this.configService.get<string>('MINIO_ENDPOINT')}/${this.bucket}/`, '');

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3.send(deleteCommand);
  } catch (err) {
    console.warn('⚠️ No se pudo eliminar del bucket MinIO:', err.message);
  }

  await this.evidenceRepo.delete(id);

  return { message: 'Evidencia eliminada correctamente' };
}



  create(createEvidenceDto: CreateEvidenceDto) {
    return 'This action adds a new evidence';
  }

  findAll() {
    return `This action returns all evidence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evidence`;
  }

  update(id: number, updateEvidenceDto: UpdateEvidenceDto) {
    return `This action updates a #${id} evidence`;
  }


}
