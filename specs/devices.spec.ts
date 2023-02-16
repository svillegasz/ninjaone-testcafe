import { fixture, Selector, t, test } from "testcafe";
import { faker } from '@faker-js/faker';
import devicePage, { IDevice } from "../pages/DevicePage";

fixture('Devices')
    .page('http://localhost:3001')
    .beforeEach(async t => {
        t.ctx.devices = Object.values((await t.request('http://localhost:3000/devices')).body);
    });

test('Test 1: List devices', async () => {
    for (const apiDevice of t.ctx.devices) {
        const device = devicePage.getDevice(apiDevice);

        await t
            .expect(device.name.innerText).eql(apiDevice.system_name)
            .expect(device.type.innerText).eql(apiDevice.type)
            .expect(device.capacity.innerText).eql(`${apiDevice.hdd_capacity} GB`)
            .expect(device.editBtn.visible).ok()
            .expect(device.deleteBtn.visible).ok()
    }
});

test('Test 2: Create devices', async () => {
    const newDevice = {
        system_name: `NewDevice - ${faker.name.firstName()}`,
        type: faker.helpers.arrayElement(['WINDOWS SERVER', 'WINDOWS WORKSTATION', 'MAC']),
        hdd_capacity: faker.datatype.number(500).toString()
    };

    devicePage.createDevice(newDevice)

    const device = devicePage.getDevice(newDevice);
    await t
        .expect(device.name.innerText).eql(newDevice.system_name)
        .expect(device.type.innerText).eql(newDevice.type)
        .expect(device.capacity.innerText).eql(`${newDevice.hdd_capacity} GB`)
});

test('Test 3: Update device', async () => {
    const oldDeviceName = await devicePage.getDeviceByIndex(0).name.innerText;
    const oldDevice = t.ctx.devices.find(device => device.system_name == oldDeviceName);
    const updatedDevice = {
        system_name: "Renamed Device",
        type: oldDevice.type,
        hdd_capacity: oldDevice.hdd_capacity
    }

    await t.request.put({
        url: `http://localhost:3000/devices/${oldDevice.id}`,
        body: updatedDevice
    });

    await t.eval(() => location.reload());

    const device = devicePage.getDevice(updatedDevice);

    await t
        .expect(device.name.innerText).eql(updatedDevice.system_name)
        .expect(device.type.innerText).eql(updatedDevice.type)
        .expect(device.capacity.innerText).eql(`${updatedDevice.hdd_capacity} GB`)
});

test('Test 4: Delete device', async () => {
    const oldDeviceName = await devicePage.getDeviceByIndex(-1).name.innerText;
    const oldDevice = t.ctx.devices.find(device => device.system_name == oldDeviceName);
    
    await t.request.delete(`http://localhost:3000/devices/${oldDevice.id}`);

    await t.eval(() => location.reload());
    
    const device = devicePage.getDevice(oldDevice);

    await t
        .expect(device.name.exists).notOk()
        .expect(device.type.exists).notOk()
        .expect(device.capacity.exists).notOk()
});
