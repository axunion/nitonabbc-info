type Subscriber<T> = (states: { prevState: T; state: T }) => void;

interface StateEntity<T> {
  data: T;
  subscribers?: Subscriber<T>[];
}

export const createState = <T>({
  data: initialData,
  subscribers: initialSubscribes = [],
}: StateEntity<T>) => {
  let state = initialData;
  const subscribers = [...initialSubscribes];
  let isUpdating = false;

  return {
    read: (): T => state,

    update: (updater: (state: T) => T): void => {
      if (isUpdating) {
        throw new Error("Cannot update state while it is being updated.");
      }

      isUpdating = true;
      const prevState = state;

      try {
        state = updater(state);
        subscribers.forEach((subscribe) => subscribe({ prevState, state }));
      } finally {
        isUpdating = false;
      }
    },

    addSubscriber: (subscriber: Subscriber<T>): void => {
      subscribers.push(subscriber);
    },

    removeSubscriber: (subscriber: Subscriber<T>): void => {
      const index = subscribers.indexOf(subscriber);

      if (index > -1) {
        subscribers.splice(index, 1);
      }
    },
  };
};
