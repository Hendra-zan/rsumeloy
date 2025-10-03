interface NavigationDestination {
    url: string;
    // Add other properties as needed
}

interface NavigateEvent extends Event {
    destination: NavigationDestination;
}

declare global {
    interface Window {
        navigation: {
            addEventListener(type: string, listener: (event: NavigateEvent) => void): void;
            removeEventListener(type: string, listener: (event: NavigateEvent) => void): void;
        }
    }
}

export type { NavigateEvent, NavigationDestination };