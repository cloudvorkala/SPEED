import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evidence, EvidenceDocument } from '../../models/evidence.model';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence.name) private evidenceModel: Model<EvidenceDocument>,
  ) {}

  async findAll(): Promise<Evidence[]> {
    return this.evidenceModel.find().exec();
  }

  async findOne(id: string): Promise<Evidence> {
    const evidence = await this.evidenceModel.findById(id).exec();
    if (!evidence) throw new Error(`Evidence with id ${id} not found`);
    return evidence;
  }

  async findByArticle(articleId: string): Promise<Evidence[]> {
    return this.evidenceModel.find({ article: articleId }).exec();
  }

  async findByClaim(claimId: string): Promise<Evidence[]> {
    return this.evidenceModel.find({ claim: claimId }).exec();
  }

  async findByPracticeAndClaim(
    practiceId: string,
    claimId?: string,
  ): Promise<Evidence[]> {
    const query: any = {};

    if (claimId) {
      query.claim = claimId;
    } else {
      // If only practice is provided, we need to find claims associated with this practice
      // and then find evidence for those claims
      // This would require a more complex aggregation pipeline in a real application
      // For simplicity, I'm assuming we have the claimId
    }

    return this.evidenceModel
      .find(query)
      .populate('article')
      .populate('claim')
      .exec();
  }

  async create(evidence: Partial<Evidence>): Promise<Evidence> {
    const newEvidence = new this.evidenceModel(evidence);
    return newEvidence.save();
  }

  async update(id: string, evidence: Partial<Evidence>): Promise<Evidence> {
    const updated = await this.evidenceModel
      .findByIdAndUpdate(id, evidence, { new: true })
      .exec();
    if (!updated) throw new Error(`Evidence with id ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<Evidence> {
    const deleted = await this.evidenceModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new Error(`Evidence with id ${id} not found`);
    return deleted;
  }
}
