import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
    // 🔑 Add properties here
    isAuthenticated: types.optional(types.boolean, false),
}).actions((self) => ({
    // 🔑 Add actions here
    setIsAuthenticated(isAuthenticated: boolean) {
        self.isAuthenticated = isAuthenticated
    },
}))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
