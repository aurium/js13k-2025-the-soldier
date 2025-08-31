import assert from 'node:assert'
import { describe, it } from 'node:test'
import { testObjsColision } from './people.js'

function assertColision(obj1, obj2, result) {
  assert.deepEqual(testObjsColision(obj1, obj2), result)
}

describe('testObjsColision', ()=> {

  const obj3x2 = (x, y)=> ({ w:3, d:2, x, y })
  const obj5x4 = (x, y)=> ({ w:5, d:4, x, y })

  describe('no colision', () => {
    it('equals, no intersection, no colision', () => {
      assertColision(obj3x2(1, 1), obj3x2(5, 5), null)
    })

    it('equals, horizontal intersection, no colision', () => {
      assertColision(obj3x2(1, 1), obj3x2(2, 5), null)
    })

    it('equals, same horizontal, no colision', () => {
      assertColision(obj3x2(1, 1), obj3x2(2, 5), null)
    })

    it('equals, vertical intersection, no colision', () => {
      assertColision(obj3x2(1, 1), obj3x2(5, 2), null)
    })

    it('equals, same vertical, no colision', () => {
      assertColision(obj3x2(1, 1), obj3x2(5, 1), null)
    })

    it('different, no intersection, no colision', () => {
      assertColision(obj5x4(1, 1), obj3x2(6, 6), null)
    })

    it('different, partial horizontal intersection, no colision', () => {
      assertColision(obj5x4(1, 1), obj3x2(4, 6), null)
    })

    it('different, horizontal overlap, no colision', () => {
      assertColision(obj5x4(1, 1), obj3x2(2, 6), null)
    })

    it('different, partial vertical intersection, no colision', () => {
      assertColision(obj5x4(1, 1), obj3x2(6, 4), null)
    })

    it('different, vertical overlap, no colision', () => {
      assertColision(obj5x4(1, 1), obj3x2(6, 2), null)
    })
  })

  describe('pure horizontal colision', ()=> {
    it('object 1 from left', () => {
      assertColision(obj3x2(1, 1), obj3x2(3, 1), { x:-1, y:0 })
    })
    it('object 1 from right', () => {
      assertColision(obj3x2(3, 1), obj3x2(1, 1), { x:1, y:0 })
    })
    it('big object 1 from left', () => {
      assertColision(obj5x4(1, 1), obj3x2(5, 2), { x:-1, y:0 })
    })
    it('small object 1 from left', () => {
      assertColision(obj3x2(1, 2), obj5x4(3, 1), { x:-1, y:0 })
    })
  })

  describe('pure vertical colision', ()=> {
    it('object 1 from above', () => {
      assertColision(obj3x2(1, 2), obj3x2(1, 1), { x:0, y:1 })
    })
    it('object 1 from below', () => {
      assertColision(obj3x2(1, 1), obj3x2(1, 2), { x:0, y:-1 })
    })
    it('big object 1 from above', () => {
      assertColision(obj5x4(1, 2), obj3x2(2, 1), { x:0, y:1 })
    })
    it('small object 1 from above', () => {
      assertColision(obj3x2(2, 4), obj5x4(1, 1), { x:0, y:1 })
    })
  })

  describe('oblique colision', ()=> {
    it('boject 1 45deg from NW', () => {
      assertColision(obj3x2(1, 2), obj3x2(3, 1), { x:-1, y:1 })
    })
    it('boject 1 45deg from NE', () => {
      assertColision(obj3x2(3, 2), obj3x2(1, 1), { x:1, y:1 })
    })
    it('boject 1 45deg from SW', () => {
      assertColision(obj3x2(1, 1), obj3x2(3, 2), { x:-1, y:-1 })
    })
    it('boject 1 45deg from SE', () => {
      assertColision(obj3x2(3, 1), obj3x2(1, 2), { x:1, y:-1 })
    })
  })
})
