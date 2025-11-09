// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Tracking {
    enum ShipmentStatus {
        PENDING,
        IN_TRANSIT,
        DELIVERED
    }

    struct Shipment {
        address sender;
        address receiver;
        address courier;
        uint256 scheduledPickupTime;
        uint256 actualPickupTime;
        uint256 deliveryTime;
        uint256 distance;
        uint256 price;
        ShipmentStatus status;
        bool isPaid;
    }

    Shipment[] public shipments; // ✅ Global unified shipment list
    uint256 public shipmentCount;

    event ShipmentCreated(
        uint256 indexed shipmentId,
        address indexed sender,
        address indexed receiver,
        address courier,
        uint256 scheduledPickupTime,
        uint256 distance,
        uint256 price
    );

    event ShipmentInTransit(uint256 indexed shipmentId, uint256 pickupTime);
    event ShipmentDelivered(uint256 indexed shipmentId, uint256 deliveryTime);
    event ShipmentPaid(uint256 indexed shipmentId, address courier, uint256 amount);

    // ✅ Create new shipment (global order)
    function createShipment(
        address _receiver,
        address _courier,
        uint256 _pickupTime,
        uint256 _distance,
        uint256 _price
    ) external payable {
        require(msg.value == _price, "Payment must match price");
        require(_courier != address(0), "Invalid courier address");

        shipments.push(
            Shipment({
                sender: msg.sender,
                receiver: _receiver,
                courier: _courier,
                scheduledPickupTime: _pickupTime,
                actualPickupTime: 0,
                deliveryTime: 0,
                distance: _distance,
                price: _price,
                status: ShipmentStatus.PENDING,
                isPaid: false
            })
        );

        shipmentCount++;

        emit ShipmentCreated(
            shipmentCount - 1,
            msg.sender,
            _receiver,
            _courier,
            _pickupTime,
            _distance,
            _price
        );
    }

    // ✅ Courier starts shipment
    function startShipment(uint256 _shipmentId) external {
        require(_shipmentId < shipmentCount, "Invalid shipment ID");

        Shipment storage s = shipments[_shipmentId];
        require(msg.sender == s.courier, "Only courier can start");
        require(s.status == ShipmentStatus.PENDING, "Already started");
        require(block.timestamp <= s.scheduledPickupTime, "Pickup expired");

        s.status = ShipmentStatus.IN_TRANSIT;
        s.actualPickupTime = block.timestamp;

        emit ShipmentInTransit(_shipmentId, block.timestamp);
    }

    // ✅ Courier marks delivered
    function markDelivered(uint256 _shipmentId) external {
        require(_shipmentId < shipmentCount, "Invalid shipment ID");
        Shipment storage s = shipments[_shipmentId];

        require(msg.sender == s.courier, "Only courier can mark delivered");
        require(s.status == ShipmentStatus.IN_TRANSIT, "Not in transit");

        s.status = ShipmentStatus.DELIVERED;
        s.deliveryTime = block.timestamp;

        emit ShipmentDelivered(_shipmentId, block.timestamp);
    }

    // ✅ Receiver confirms and releases payment
    function confirmDelivery(uint256 _shipmentId) external {
        require(_shipmentId < shipmentCount, "Invalid shipment ID");
        Shipment storage s = shipments[_shipmentId];

        require(msg.sender == s.receiver, "Only receiver can confirm");
        require(s.status == ShipmentStatus.DELIVERED, "Not delivered yet");
        require(!s.isPaid, "Already paid");

        s.isPaid = true;
        payable(s.courier).transfer(s.price);

        emit ShipmentPaid(_shipmentId, s.courier, s.price);
    }

    // ✅ View all shipments (global order)
    function getAllShipments() external view returns (Shipment[] memory) {
        return shipments;
    }

    // ✅ View shipment details — restricted to sender
    function getShipmentDetails(uint256 _shipmentId)
        external
        view
        returns (Shipment memory)
    {
        require(_shipmentId < shipmentCount, "Invalid shipment ID");
        Shipment memory s = shipments[_shipmentId];
        require(
            msg.sender == s.sender,
            "Only sender can view full shipment details"
        );
        return s;
    }

    // ✅ Get shipments count created by any specific sender
    function getSenderShipmentCount(address _sender)
        external
        view
        returns (uint256 count)
    {
        uint256 total = shipmentCount;
        for (uint256 i = 0; i < total; i++) {
            if (shipments[i].sender == _sender) {
                count++;
            }
        }
    }

    // ✅ Gas-optimized filtered view for sender’s own shipments
    function getShipmentsBySender(address _sender)
        external
        view
        returns (Shipment[] memory senderShipments)
    {
        uint256 total = shipmentCount;
        uint256 count = 0;

        // Count first
        for (uint256 i = 0; i < total; i++) {
            if (shipments[i].sender == _sender) count++;
        }

        senderShipments = new Shipment[](count);
        uint256 index = 0;

        // Fill results
        for (uint256 i = 0; i < total; i++) {
            if (shipments[i].sender == _sender) {
                senderShipments[index] = shipments[i];
                index++;
            }
        }
    }
}
