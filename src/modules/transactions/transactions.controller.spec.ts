import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

const mockService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const req = { user: { authId: 'auth-id-1' } };
const tx = { id: 'tx-1', amount: 50, type: 'expense', description: 'Food', date: '2025-01-01' };

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: mockService }],
    }).compile();

    controller = module.get(TransactionsController);
    jest.clearAllMocks();
  });

  it('GET /transactions — returns list for user', async () => {
    mockService.findAll.mockResolvedValue([tx]);
    const result = await controller.findAll(req as any, {});
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', {});
    expect(result).toEqual([tx]);
  });

  it('GET /transactions — passes query filters', async () => {
    mockService.findAll.mockResolvedValue([]);
    const query = { savingsId: 'sav-1', type: 'expense' };
    await controller.findAll(req as any, query);
    expect(mockService.findAll).toHaveBeenCalledWith('auth-id-1', query);
  });

  it('GET /transactions/:id — returns transaction', async () => {
    mockService.findOne.mockResolvedValue(tx);
    const result = await controller.findOne('tx-1', req as any);
    expect(mockService.findOne).toHaveBeenCalledWith('tx-1', 'auth-id-1');
    expect(result).toBe(tx);
  });

  it('GET /transactions/:id — propagates NotFoundException', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('bad-id', req as any)).rejects.toThrow(NotFoundException);
  });

  it('POST /transactions — creates transaction', async () => {
    mockService.create.mockResolvedValue(tx);
    const dto = { amount: 50, type: 'expense', description: 'Food', date: '2025-01-01' } as any;
    const result = await controller.create(req as any, dto);
    expect(mockService.create).toHaveBeenCalledWith('auth-id-1', dto);
    expect(result).toBe(tx);
  });

  it('PATCH /transactions/:id — updates transaction', async () => {
    const updated = { ...tx, amount: 75 };
    mockService.update.mockResolvedValue(updated);
    const dto = { amount: 75 } as any;
    const result = await controller.update('tx-1', dto, req as any);
    expect(mockService.update).toHaveBeenCalledWith('tx-1', dto, 'auth-id-1');
    expect(result).toBe(updated);
  });

  it('DELETE /transactions/:id — removes transaction', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });
    const result = await controller.remove('tx-1', req as any);
    expect(mockService.remove).toHaveBeenCalledWith('tx-1', 'auth-id-1');
    expect(result).toEqual({ deleted: true });
  });
});
