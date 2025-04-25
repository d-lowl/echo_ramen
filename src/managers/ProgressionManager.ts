import Game from '../game/Game';
import { EventEmitter } from 'events';
import Phaser from 'phaser';

export interface FloorData {
  floorNumber: number;
  difficulty: number;
  isBossFloor: boolean;
  totalCustomers: number;
  currentCustomer: number;
}

export enum ProgressionEvent {
  CUSTOMER_COMPLETE = 'customer_complete',
  FLOOR_COMPLETE = 'floor_complete',
  GAME_COMPLETE = 'game_complete',
  NEW_CUSTOMER = 'new_customer',
  NEW_FLOOR = 'new_floor'
}

/**
 * Manages the game progression system with multiple floors and customers
 */
export default class ProgressionManager extends EventEmitter {
  private currentFloor: number = 1;
  private currentCustomer: number = 1;
  private totalFloors: number = 4; // 3 regular floors + 1 boss floor
  private customersPerFloor: number = 2;
  private bossFloorCustomers: number = 2;
  private gameInstance: Game;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, gameInstance: Game) {
    super();
    this.scene = scene;
    this.gameInstance = gameInstance;
  }

  /**
   * Returns data about the current floor
   */
  public getCurrentFloorData(): FloorData {
    const isBossFloor = this.currentFloor === this.totalFloors;
    return {
      floorNumber: this.currentFloor,
      difficulty: this.getDifficultyForFloor(this.currentFloor),
      isBossFloor,
      totalCustomers: isBossFloor ? this.bossFloorCustomers : this.customersPerFloor,
      currentCustomer: this.currentCustomer
    };
  }

  /**
   * Advances to the next customer or floor if all customers are served
   */
  public nextCustomer(): void {
    const isBossFloor = this.currentFloor === this.totalFloors;
    const customersInCurrentFloor = isBossFloor ? this.bossFloorCustomers : this.customersPerFloor;

    // Customer completion
    this.emit(ProgressionEvent.CUSTOMER_COMPLETE, {
      floorNumber: this.currentFloor,
      customerNumber: this.currentCustomer
    });

    if (this.currentCustomer >= customersInCurrentFloor) {
      this.completeFloor();
    } else {
      // Move to next customer
      this.currentCustomer++;
      this.emit(ProgressionEvent.NEW_CUSTOMER, {
        floorNumber: this.currentFloor,
        customerNumber: this.currentCustomer,
        isBoss: isBossFloor && this.currentCustomer === this.bossFloorCustomers
      });
    }
  }

  /**
   * Complete the current floor and advance to the next one
   */
  private completeFloor(): void {
    this.emit(ProgressionEvent.FLOOR_COMPLETE, {
      floorNumber: this.currentFloor
    });

    if (this.currentFloor >= this.totalFloors) {
      // Game is complete
      this.emit(ProgressionEvent.GAME_COMPLETE, {
        finalScore: this.gameInstance.getScore()
      });
    } else {
      // Advance to next floor
      this.currentFloor++;
      this.currentCustomer = 1;
      
    

      // Update game difficulty
      this.gameInstance.setDifficulty(this.getDifficultyForFloor(this.currentFloor));
      
      this.emit(ProgressionEvent.NEW_FLOOR, {
        floorNumber: this.currentFloor,
        difficulty: this.getDifficultyForFloor(this.currentFloor),
        isBossFloor: this.currentFloor === this.totalFloors
      });
    }
  }

  /**
   * Get difficulty level for a specific floor
   */
  private getDifficultyForFloor(floor: number): number {
    return Math.min(4, floor); // Difficulty 1-3 for regular floors, 4 for boss floor
  }

  /**
   * Check if the current floor is a boss floor
   */
  public isBossFloor(): boolean {
    return this.currentFloor === this.totalFloors;
  }

  /**
   * Check if the current customer is a boss
   */
  public isCurrentCustomerBoss(): boolean {
    return this.isBossFloor() && this.currentCustomer === this.bossFloorCustomers;
  }

  /**
   * Reset progression to start a new game
   */
  public reset(): void {
    this.currentFloor = 1;
    this.currentCustomer = 1;
    this.gameInstance.setDifficulty(this.getDifficultyForFloor(1));
  }
} 