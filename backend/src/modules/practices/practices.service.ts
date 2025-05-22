import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practice, PracticeDocument } from '../../models/practice.model';

@Injectable()
export class PracticesService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<PracticeDocument>,
  ) {}

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().exec();
  }

  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceModel.findById(id).exec();
    if (!practice) throw new Error(`Practice with id ${id} not found`);
    return practice;
  }

  async create(practice: Partial<Practice>): Promise<Practice> {
    const newPractice = new this.practiceModel(practice);
    return newPractice.save();
  }

  async update(id: string, practice: Partial<Practice>): Promise<Practice> {
    const updated = await this.practiceModel
      .findByIdAndUpdate(id, practice, { new: true })
      .exec();
    if (!updated) throw new Error(`Practice with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<Practice> {
    const deleted = await this.practiceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new Error(`Practice with id ${id} not found`);
    return deleted;
  }
}