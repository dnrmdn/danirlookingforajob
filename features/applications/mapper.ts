import { ApplicationEntity } from './domain/entity';
import { ApplicationSummaryResponse, ApplicationDetailResponse } from './dto';

export class ApplicationMapper {
  static toSummaryResponse(entity: ApplicationEntity): ApplicationSummaryResponse {
    return {
      id: entity.id,
      position: entity.position,
      company: entity.company,
      status: entity.status,
      source: entity.source,
      appliedAt: entity.appliedAt?.toISOString().split('T')[0] || null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDetailResponse(entity: ApplicationEntity): ApplicationDetailResponse {
    return {
      ...this.toSummaryResponse(entity),
      location: entity.location,
      salary: entity.salary,
      description: entity.description,
      url: entity.url,
      source: entity.source,
      method: entity.method,
      interviewAt: entity.interviewAt?.toISOString() || null,
    };
  }
}
