package com.metering.plane.hudi.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class EvidenceEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    private String eventId;
    private String tenantId;
    private String meterId;
    private Timestamp eventTimestamp;
    private String payloadHash;
    private String rawPayload;

    public EvidenceEvent() {}

    public EvidenceEvent(String eventId, String tenantId, String meterId, 
                         Timestamp eventTimestamp, String payloadHash, String rawPayload) {
        this.eventId = eventId;
        this.tenantId = tenantId;
        this.meterId = meterId;
        this.eventTimestamp = eventTimestamp;
        this.payloadHash = payloadHash;
        this.rawPayload = rawPayload;
    }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getMeterId() { return meterId; }
    public void setMeterId(String meterId) { this.meterId = meterId; }

    public Timestamp getEventTimestamp() { return eventTimestamp; }
    public void setEventTimestamp(Timestamp eventTimestamp) { this.eventTimestamp = eventTimestamp; }

    public String getPayloadHash() { return payloadHash; }
    public void setPayloadHash(String payloadHash) { this.payloadHash = payloadHash; }

    public String getRawPayload() { return rawPayload; }
    public void setRawPayload(String rawPayload) { this.rawPayload = rawPayload; }
}
