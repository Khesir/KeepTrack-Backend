import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MonthPlansController } from './month-plans.controller';
import { MonthPlansService } from './month-plans.service';

const mockService = {
  findAll: jest.fn(),
  findByMonth: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const plan = { id: 'plan-1', month: '2025-01' };

describe('MonthPlansController', () => {
  let controller: MonthPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthPlansController],
      providers: [{ provide: MonthPlansService, useValue: mockService }],
    }).compile();

    controller = module.get(MonthPlansController);
    jest.clearAllMocks();
  });

  it('GET /month-plans — returns all plans', async () => {
    mockService.findAll.mockResolvedValue([plan]);
    const result = await controller.findAll(req as any);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1');
    expect(result).toEqual([plan]);
  });

  it('GET /month-plans/by-month/:month — returns plan for month', async () => {
    mockService.findByMonth.mockResolvedValue(plan);
    const result = await controller.findByMonth('2025-01', req as any);
    expect(mockService.findByMonth).toHaveBeenCalledWith('2025-01', 'auth-id-1');
    expect(result).toBe(plan);
  });

  it('GET /month-plans/:id — returns plan', async () => {
    mockService.findOne.mockResolvedValue(plan);
    const result = await controller.findOne('plan-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('plan-1', 'auth-id-1');
    expect(result).toBe(plan);
  });

  it('GET /month-plans/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /month-plans — creates plan', async () => {
    mockService.create.mockResolvedValue(plan);
    const dto = { month: '2025-01' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(plan);
  });

  it('PATCH /month-plans/:id — updates plan', async () => {
    const updated = { ...plan, notes: 'Updated' };
    mockService.update.mockResolvedValue(updated);
    const dto = { notes: 'Updated' } as any;
    const result = await controller.update('plan-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('plan-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /month-plans/:id — removes plan', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    await controller.remove('plan-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('plan-1', 'auth-id-1');
  });
});
