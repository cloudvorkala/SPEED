import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimDocument } from '../../models/claim.model';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<ClaimDocument>,
  ) {}

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    if (!claim) throw new Error(`Claim with id ${id} not found`);
    return claim;
  }

  async findByPractice(practiceId: string): Promise<Claim[]> {
    return this.claimModel.find({ practice: practiceId }).exec();
  }

  async create(claim: Partial<Claim>): Promise<Claim> {
    const newClaim = new this.claimModel(claim);
    return newClaim.save();
  }

  async update(id: string, claim: Partial<Claim>): Promise<Claim> {
    const updated = await this.claimModel
      .findByIdAndUpdate(id, claim, { new: true })
      .exec();
    if (!updated) throw new Error(`Claim with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<Claim> {
    const deleted = await this.claimModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new Error(`Claim with id ${id} not found`);
    return deleted;
  }
}
