package org.sareekala.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "image_table")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String type;
    @Column(length=50000000)
    private byte[] bytes;



    public Image() {

    }

    public Image(String name, String type, byte[] bytes) {
        this.name = name;
        this.type = type;
        this.bytes = bytes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getBytes() {
        return bytes;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }
}
