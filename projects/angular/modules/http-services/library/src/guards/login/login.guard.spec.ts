import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Chance } from 'chance';
import * as jsonwebtoken from 'jsonwebtoken';

import { EnvironmentService } from '../../services/environment/environment.service';
import { EnvironmentServiceMock } from '../../services/environment/environment.service.mock';
import { LoginService } from '../../services/login/login.service';
import { IdentityService } from '../../services/identity/identity.service';
import { HttpServicesModule } from '../../module';

import { LoginGuard } from './login.guard';

describe('LoginGuard', () => {
  const chance = new Chance();

  let identityService: IdentityService;
  let loginService: LoginService;
  let router: Router;
  let service: LoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpServicesModule],
      providers: [
        IdentityService,
        {
          provide: EnvironmentService,
          useClass: EnvironmentServiceMock,
        },
        {
          provide: Router,
          useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
        },
      ],
    });

    identityService = TestBed.get(IdentityService);
    loginService = TestBed.get(LoginService);
    router = TestBed.get(Router);
    service = TestBed.get(LoginGuard);
  });

  describe('canActivate()', () => {
    describe('when user is authenticated', () => {
      beforeEach(() => {
        const secret = chance.hash();
        identityService.accessToken = jsonwebtoken.sign({}, secret);
        identityService.refreshToken = jsonwebtoken.sign({}, secret);

        spyOn(loginService, 'createWithRefreshToken').and.returnValue(Promise.resolve());
      });

      it('it returns true', async () => {
        const result = await service.canActivate();

        expect(result).toEqual(true);
      });
    });

    describe('when user is not authenticated', () => {
      beforeEach(() => {
        identityService.refreshToken = null;
      });

      it('it navigates to the login page', async () => {
        await service.canActivate();

        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      });

      it('returns false', async () => {
        const result = await service.canActivate();

        expect(result).toEqual(false);
      });
    });
  });
});
