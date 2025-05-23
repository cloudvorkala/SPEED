import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PracticesService } from './practices.service';
import { Practice } from '../../models/practice.model';
import { Claim } from '../../models/claim.model';
import { Evidence } from '../../models/evidence.model';

describe('PracticesService', () => {
  let service: PracticesService;
  let practiceModel: Model<Practice>;
  let claimModel: Model<Claim>;
  let evidenceModel: Model<Evidence>;

  const mockPractice = {
    _id: new Types.ObjectId(),
    name: 'Test Practice',
    description: 'Test Description',
    save: jest.fn(),
  };

  const mockClaim = {
    _id: new Types.ObjectId(),
    description: 'Test Description',
    practice: new Types.ObjectId(),
    save: jest.fn(),
  };

  const mockEvidence = {
    _id: new Types.ObjectId(),
    article: new Types.ObjectId(),
    claim: new Types.ObjectId(),
    result: 'AGREE',
    researchType: 'CASE_STUDY',
    participantType: 'STUDENT',
    notes: 'Test Notes',
    analyst: new Types.ObjectId(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticesService,
        {
          provide: getModelToken(Practice.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Claim.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(Evidence.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PracticesService>(PracticesService);
    practiceModel = module.get<Model<Practice>>(getModelToken(Practice.name));
    claimModel = module.get<Model<Claim>>(getModelToken(Claim.name));
    evidenceModel = module.get<Model<Evidence>>(getModelToken(Evidence.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of practices', async () => {
      jest.spyOn(practiceModel, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce([mockPractice]),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual([mockPractice]);
    });
  });

  describe('findOne', () => {
    it('should return a practice by id', async () => {
      jest.spyOn(practiceModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPractice),
      } as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockPractice);
    });
  });

  describe('create', () => {
    it('should create a new practice', async () => {
      const newPractice = {
        name: 'New Practice',
        description: 'New Description',
      };

      jest.spyOn(practiceModel, 'create').mockResolvedValueOnce(mockPractice as any);

      const result = await service.create(newPractice);
      expect(result).toEqual(mockPractice);
    });
  });

  describe('update', () => {
    it('should update a practice', async () => {
      const updatePractice: Partial<Practice> = {
        name: 'Updated Practice',
      };

      jest.spyOn(practiceModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({ ...mockPractice, ...updatePractice }),
      } as any);

      const result = await service.update('1', updatePractice);
      expect(result).toEqual({ ...mockPractice, ...updatePractice });
    });
  });

  describe('addClaim', () => {
    it('should add a claim to a practice', async () => {
      const newClaim: Partial<Claim> = {
        description: 'New Description',
      };

      jest.spyOn(practiceModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPractice),
      } as any);

      jest.spyOn(claimModel, 'create').mockResolvedValueOnce(mockClaim as any);

      const result = await service.addClaim('1', newClaim);
      expect(result).toEqual(mockClaim);
    });
  });

  describe('addEvidence', () => {
    it('should add evidence to a claim', async () => {
      const newEvidence: Partial<Evidence> = {
        article: new Types.ObjectId(),
        result: 'AGREE',
        researchType: 'CASE_STUDY',
        participantType: 'STUDENT',
        notes: 'New Notes',
        analyst: new Types.ObjectId(),
      };

      jest.spyOn(practiceModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockPractice),
      } as any);

      jest.spyOn(claimModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockClaim),
      } as any);

      jest.spyOn(evidenceModel, 'create').mockResolvedValueOnce(mockEvidence as any);

      const result = await service.addEvidence('1', '1', newEvidence);
      expect(result).toEqual(mockEvidence);
    });
  });
});