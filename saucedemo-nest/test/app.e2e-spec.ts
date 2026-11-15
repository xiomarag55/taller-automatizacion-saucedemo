import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SUT carrito de compras (e2e API)', () => {
  let app: INestApplication;
  let http: any;

  const login = async (username = 'standard_user', password = 'secret_sauce') =>
    request(http).post('/api/auth/login').send({ username, password });
  const tokenOf = async () => (await login()).body.token as string;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    await app.init();
    http = app.getHttpServer();
  });
  afterAll(() => app.close());
  beforeEach(() => request(http).post('/api/test/reset'));

  describe('Login', () => {
    it('usuario valido obtiene token', async () => {
      const r = await login();
      expect(r.status).toBe(200);
      expect(r.body.token).toBeDefined();
    });
    it.each([
      ['', 'secret_sauce', 401, 'Epic sadface: Username is required'],
      ['standard_user', '', 401, 'Epic sadface: Password is required'],
      ['standard_user', 'mala', 401, 'Epic sadface: Username and password do not match any user in this service'],
      ['locked_out_user', 'secret_sauce', 403, 'Epic sadface: Sorry, this user has been locked out.'],
    ])('rechaza (%s / %s)', async (u, p, status, msg) => {
      const r = await login(u, p);
      expect(r.status).toBe(status);
      expect(r.body.message).toBe(msg);
    });
  });

  describe('Seguridad', () => {
    it('inventario sin sesion devuelve 401', async () => {
      expect((await request(http).get('/api/products')).status).toBe(401);
    });
    it('el token deja de servir tras logout', async () => {
      const t = await tokenOf();
      await request(http).post('/api/auth/logout').set('Authorization', `Bearer ${t}`).expect(204);
      await request(http).get('/api/cart').set('Authorization', `Bearer ${t}`).expect(401);
    });
  });

  describe('Carrito', () => {
    it('lista 6 productos', async () => {
      const t = await tokenOf();
      const r = await request(http).get('/api/products').set('Authorization', `Bearer ${t}`);
      expect(r.body).toHaveLength(6);
    });

    it('agregar 3 y quitar 1 deja contador en 2', async () => {
      const t = await tokenOf();
      const auth = { Authorization: `Bearer ${t}` };
      await request(http).post('/api/cart/4').set(auth).expect(201);
      await request(http).post('/api/cart/0').set(auth).expect(201);
      await request(http).post('/api/cart/1').set(auth).expect(201);
      const r = await request(http).delete('/api/cart/0').set(auth).expect(200);
      expect(r.body.count).toBe(2);
      expect(r.body.items.map((i: any) => i.name)).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt']);
    });

    it('duplicado devuelve 409 y producto inexistente 404', async () => {
      const t = await tokenOf();
      const auth = { Authorization: `Bearer ${t}` };
      await request(http).post('/api/cart/4').set(auth);
      await request(http).post('/api/cart/4').set(auth).expect(409);
      await request(http).post('/api/cart/999').set(auth).expect(404);
    });

    it('quitar algo que no esta en el carrito devuelve 404', async () => {
      const t = await tokenOf();
      await request(http).delete('/api/cart/4').set({ Authorization: `Bearer ${t}` }).expect(404);
    });
  });

  describe('Checkout', () => {
    const auth = (t: string) => ({ Authorization: `Bearer ${t}` });

    it('valida campos obligatorios', async () => {
      const t = await tokenOf();
      const r = await request(http).post('/api/checkout/info').set(auth(t)).send({ lastName: 'x', postalCode: '1' });
      expect(r.status).toBe(400);
      expect(r.body.message).toBe('Error: First Name is required');
    });

    it('calcula subtotal, impuesto (8%) y total', async () => {
      const t = await tokenOf();
      await request(http).post('/api/cart/4').set(auth(t)); // 29.99
      await request(http).post('/api/cart/0').set(auth(t)); // 9.99
      const r = await request(http).get('/api/checkout/overview').set(auth(t));
      expect(r.body).toMatchObject({ itemTotal: 39.98, tax: 3.2, total: 43.18 });
    });

    it('flujo completo: finalizar orden vacia el carrito', async () => {
      const t = await tokenOf();
      await request(http).post('/api/cart/4').set(auth(t));
      await request(http).post('/api/checkout/info').set(auth(t)).send({ firstName: 'A', lastName: 'B', postalCode: '050001' }).expect(200);
      const f = await request(http).post('/api/checkout/finish').set(auth(t)).expect(200);
      expect(f.body.message).toBe('Thank you for your order!');
      expect((await request(http).get('/api/cart').set(auth(t))).body.count).toBe(0);
    });

    it('no permite finalizar con carrito vacio', async () => {
      const t = await tokenOf();
      await request(http).post('/api/checkout/info').set(auth(t)).send({ firstName: 'A', lastName: 'B', postalCode: '1' });
      await request(http).post('/api/checkout/finish').set(auth(t)).expect(400);
    });
  });
});
