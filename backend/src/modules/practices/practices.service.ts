import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Practice } from '../../models/practice.model';
import { Claim } from '../../models/claim.model';
import { Evidence } from '../../models/evidence.model';

@Injectable()
export class PracticesService {
  constructor(
    @InjectModel(Practice.name) private practiceModel: Model<Practice>,
    @InjectModel(Claim.name) private claimModel: Model<Claim>,
    @InjectModel(Evidence.name) private evidenceModel: Model<Evidence>,
  ) {}

  async findAll(): Promise<Practice[]> {
    return this.practiceModel.find().exec();
  }

  async findOne(id: string): Promise<Practice | null> {
    return this.practiceModel.findById(id).exec();
  }

  async create(practice: Partial<Practice>): Promise<Practice> {
    return this.practiceModel.create(practice);
  }

  async update(id: string, practice: Partial<Practice>): Promise<Practice | null> {
    return this.practiceModel
      .findByIdAndUpdate(id, practice, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Practice> {
    const deleted = await this.practiceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new Error(`Practice with id ${id} not found`);
    return deleted;
  }

  async addClaim(practiceId: string, claim: Partial<Claim>): Promise<Claim> {
    const practice = await this.practiceModel.findById(practiceId).exec();
    if (!practice) throw new Error(`Practice with id ${practiceId} not found`);

    return this.claimModel.create({
      ...claim,
      practice: practiceId,
    });
  }

  async addEvidence(
    practiceId: string,
    claimId: string,
    evidence: Partial<Evidence>,
  ): Promise<Evidence> {
    const practice = await this.practiceModel.findById(practiceId).exec();
    if (!practice) throw new Error(`Practice with id ${practiceId} not found`);

    const claim = await this.claimModel.findById(claimId).exec();
    if (!claim) throw new Error(`Claim with id ${claimId} not found`);

    return this.evidenceModel.create({
      ...evidence,
      claim: claimId,
    });
  }
}