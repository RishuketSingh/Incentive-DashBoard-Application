export class DragDropManager {
    constructor() {
        this.draggedItem = null;
        this.dragOverItem = null;
        this.widgetManager = null;
    }

    init(widgetManager) {
        this.widgetManager = widgetManager;
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const widgetsContainer = document.getElementById('widgets-container');
        
        if (!widgetsContainer) {
            console.error('Widgets container not found');
            return;
        }

        // Event listeners for drag and drop
        widgetsContainer.addEventListener('dragstart', this.handleDragStart.bind(this));
        widgetsContainer.addEventListener('dragover', this.handleDragOver.bind(this));
        widgetsContainer.addEventListener('dragleave', this.handleDragLeave.bind(this));
        widgetsContainer.addEventListener('drop', this.handleDrop.bind(this));
        widgetsContainer.addEventListener('dragend', this.handleDragEnd.bind(this));

        // Make all existing widgets draggable
        this.makeWidgetsDraggable();
    }

    makeWidgetsDraggable() {
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            widget.setAttribute('draggable', 'true');
        });
    }

    handleDragStart(e) {
        if (!e.target.classList.contains('widget')) {
            return;
        }

        this.draggedItem = e.target;
        e.target.classList.add('dragging');
        
        // Set drag image
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e) {
        e.preventDefault();
        
        const widget = e.target.closest('.widget');
        if (!widget || widget === this.draggedItem) {
            return;
        }

        this.dragOverItem = widget;
        
        // Calculate mouse position to determine drop position
        const mouseY = e.clientY;
        const widgetRect = widget.getBoundingClientRect();
        const widgetMiddleY = widgetRect.top + widgetRect.height / 2;
        
        // Show visual indicator
        widget.classList.remove('drag-over-top', 'drag-over-bottom');
        
        if (mouseY < widgetMiddleY) {
            widget.classList.add('drag-over-top');
        } else {
            widget.classList.add('drag-over-bottom');
        }
    }

    handleDragLeave(e) {
        const widget = e.target.closest('.widget');
        if (widget) {
            widget.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedItem || !this.dragOverItem) {
            return;
        }

        const widgetsContainer = document.getElementById('widgets-container');
        const draggedId = this.draggedItem.id;
        const targetId = this.dragOverItem.id;
        
        // Get all widget elements
        const widgets = Array.from(widgetsContainer.querySelectorAll('.widget'));
        
        // Remove drag classes
        widgets.forEach(w => {
            w.classList.remove('drag-over-top', 'drag-over-bottom', 'drag-over');
        });

        // Reorder widgets in DOM
        if (this.dragOverItem.classList.contains('drag-over-top')) {
            widgetsContainer.insertBefore(this.draggedItem, this.dragOverItem);
        } else {
            widgetsContainer.insertBefore(this.draggedItem, this.dragOverItem.nextSibling);
        }

        // Update positions in widget manager
        this.updateWidgetPositions();
        
        // Dispatch event to notify about layout change
        this.dispatchLayoutChangeEvent();
    }

    handleDragEnd(e) {
        // Clean up drag classes
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            widget.classList.remove('dragging', 'drag-over-top', 'drag-over-bottom', 'drag-over');
        });

        this.draggedItem = null;
        this.dragOverItem = null;
    }

    updateWidgetPositions() {
        const widgetsContainer = document.getElementById('widgets-container');
        const widgets = Array.from(widgetsContainer.querySelectorAll('.widget'));
        
        // Update positions based on DOM order
        widgets.forEach((widget, index) => {
            const widgetId = widget.id;
            // Update position in widget manager if available
            if (this.widgetManager && this.widgetManager.updateWidgetPosition) {
                this.widgetManager.updateWidgetPosition(widgetId, index);
            }
        });
    }

    dispatchLayoutChangeEvent() {
        const event = new CustomEvent('dashboardLayoutChanged', {
            detail: {
                message: 'Widget layout has been updated',
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    // Public method to add drag and drop to new widgets
    makeWidgetDraggable(widgetElement) {
        widgetElement.setAttribute('draggable', 'true');
    }

    // Method to handle touch events for mobile devices
    setupTouchEvents() {
        // This would be implemented for mobile drag and drop support
        console.log('Touch events setup would go here');
    }

    // Clean up method
    destroy() {
        const widgetsContainer = document.getElementById('widgets-container');
        if (widgetsContainer) {
            widgetsContainer.removeEventListener('dragstart', this.handleDragStart);
            widgetsContainer.removeEventListener('dragover', this.handleDragOver);
            widgetsContainer.removeEventListener('dragleave', this.handleDragLeave);
            widgetsContainer.removeEventListener('drop', this.handleDrop);
            widgetsContainer.removeEventListener('dragend', this.handleDragEnd);
        }
    }
}