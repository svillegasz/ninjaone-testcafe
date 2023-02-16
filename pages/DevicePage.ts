import { Selector, t } from "testcafe";

export interface IDevice {
    system_name: string,
    type: string,
    hdd_capacity: string
}

class DevicePage {
    public get addDevice() { return Selector('.submitButton'); }
    public get systemName() { return Selector('#system_name'); }
    public get typeSelector() { return Selector('#type'); }
    public get typeOption() { return Selector('option'); }
    public get hddCapacity() { return Selector('#hdd_capacity'); }
    public get saveBtn() { return Selector('.submitButton'); }
    public get devices() { return Selector('.list-devices'); }
    public get deviceNames() { return Selector('.device-name'); }
    public get deviceType() { return Selector('.device-type'); }
    public get deviceCapacity() { return Selector('.device-capacity'); }
    public get deviceEdit() { return Selector('.device-edit'); }
    public get deviceRemove() { return Selector('.device-remove'); }

    public getDevice(device: IDevice) {
        const deviceBox = this.devices.find(node => {
            if (!node.textContent) return false;
            return node.textContent.includes(device.system_name);
        }, { device });
        return this.getDeviceData(deviceBox)
    }

    public getDeviceByIndex(index: number) {
        const deviceBox = this.devices.nth(index);
        return this.getDeviceData(deviceBox)
    }

    public getDeviceData(deviceBox: Selector) {
        return {
            name: deviceBox.find('.device-name'),
            type: deviceBox.find('.device-type'),
            capacity: deviceBox.find('.device-capacity'),
            editBtn: deviceBox.find('.device-edit'),
            deleteBtn: deviceBox.find('.device-remove'),
        }
    }

    public async createDevice(device: IDevice) {
        await t
            .click(this.addDevice)
            .typeText(this.systemName, device.system_name)
            .click(this.typeSelector)
            .click(this.typeOption.withText(device.type))
            .typeText(this.hddCapacity, device.hdd_capacity)
            .click(this.saveBtn);
    }
}

export default new DevicePage();
