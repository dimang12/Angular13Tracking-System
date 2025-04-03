import { TestBed } from '@angular/core/testing';

import { GroupProjectService } from './group-project.service';

describe('ProjectGroupService', () => {
  let service: GroupProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
