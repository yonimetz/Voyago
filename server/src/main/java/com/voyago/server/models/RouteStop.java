package com.voyago.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "route_stops")
@Data
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String locationName;
    private String address;
    private String visitTime; // שעת ביקור מתוכננת
    private String imageKeyword;

    @Column(columnDefinition = "TEXT")
    private String personalNote;

    @Column(name = "attached_document_url")
    private String attachedDocumentUrl;

    @Column(name = "attached_document_name")
    private String attachedDocumentName;

    @ManyToOne
    @JoinColumn(name = "day_id", nullable = false)
    @JsonIgnore
    private TripDay tripDay;

    public String getImageKeyword() { return imageKeyword; }
    public void setImageKeyword(String imageKeyword) { this.imageKeyword = imageKeyword; }


    public String getPersonalNote() {
        return personalNote;
    }

    public void setPersonalNote(String personalNote) {
        this.personalNote = personalNote;
    }

    public String getAttachedDocumentUrl() {
        return attachedDocumentUrl;
    }

    public void setAttachedDocumentUrl(String attachedDocumentUrl) {
        this.attachedDocumentUrl = attachedDocumentUrl;
    }

    public String getAttachedDocumentName() {
        return attachedDocumentName;
    }

    public void setAttachedDocumentName(String attachedDocumentName) {
        this.attachedDocumentName = attachedDocumentName;
    }
}